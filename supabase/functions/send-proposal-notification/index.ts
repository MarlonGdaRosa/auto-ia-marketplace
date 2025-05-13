
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { proposalId, vehicleId, customerName, customerEmail } = await req.json()
    
    if (!proposalId || !vehicleId || !customerName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get vehicle details
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .select('brand, model, seller_id')
      .eq('id', vehicleId)
      .single()
    
    if (vehicleError || !vehicleData) {
      console.error('Error fetching vehicle:', vehicleError)
      return new Response(
        JSON.stringify({ error: 'Vehicle not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Get seller details
    const { data: sellerData, error: sellerError } = await supabase
      .from('sellers')
      .select('name, email')
      .eq('id', vehicleData.seller_id)
      .single()
    
    if (sellerError || !sellerData || !sellerData.email) {
      console.error('Error fetching seller or seller has no email:', sellerError)
      // Continue but note the error
      console.log('Will not send email notification to seller')
    }
    
    // Send notification to seller via email if they have an email
    // In a real implementation, you would use an email service like SendGrid, AWS SES, etc.
    if (sellerData && sellerData.email) {
      console.log(`Sending email notification to seller ${sellerData.name} at ${sellerData.email}`)
      
      // Here you would call an email service API
      // For now, we just log the details
      console.log({
        to: sellerData.email,
        subject: `Nova proposta para ${vehicleData.brand} ${vehicleData.model}`,
        message: `Olá ${sellerData.name},
          
Você recebeu uma nova proposta para o veículo ${vehicleData.brand} ${vehicleData.model}.
          
Detalhes da proposta:
- Nome do cliente: ${customerName}
- Email do cliente: ${customerEmail}
          
Acesse o painel administrativo para ver mais detalhes e responder à proposta.
          
Atenciosamente,
Equipe de Vendas`
      })
    }
    
    // Also send notification to admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'admin')
    
    if (!adminError && adminUsers && adminUsers.length > 0) {
      console.log(`Sending notifications to ${adminUsers.length} admin users`)
      
      // In a real implementation, you would send emails to all admins
      adminUsers.forEach(admin => {
        if (admin.email) {
          console.log(`Sending email notification to admin at ${admin.email}`)
          
          // Here you would call an email service API
          // For now, we just log the details
          console.log({
            to: admin.email,
            subject: `Nova proposta para ${vehicleData.brand} ${vehicleData.model}`,
            message: `Nova proposta recebida:
              
Veículo: ${vehicleData.brand} ${vehicleData.model}
Cliente: ${customerName}
Email: ${customerEmail}
              
Acesse o painel administrativo para verificar e responder.`
          })
        }
      })
    }
    
    // Record the notification in a log (optional)
    const { data: logData, error: logError } = await supabase
      .from('notification_logs')
      .insert({
        proposal_id: proposalId,
        vehicle_id: vehicleId,
        seller_id: vehicleData.seller_id,
        notification_type: 'new_proposal',
        recipient_type: 'seller',
        status: 'sent'
      })
      .select()
    
    if (logError) {
      console.error('Error logging notification:', logError)
      // Continue despite log error
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Notification sent successfully',
        details: {
          proposal: proposalId,
          vehicle: `${vehicleData.brand} ${vehicleData.model}`,
          seller: sellerData?.name || 'Unknown',
          notified: {
            seller: sellerData?.email ? true : false,
            admins: adminUsers?.length || 0
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
    
  } catch (error) {
    console.error('Unexpected error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
