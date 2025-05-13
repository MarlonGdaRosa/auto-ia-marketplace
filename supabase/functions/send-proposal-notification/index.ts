
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const requestData = await req.json()
    const { proposal_id } = requestData

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the proposal data
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select('*, vehicle:vehicle_id(*)')
      .eq('id', proposal_id)
      .single()

    if (proposalError || !proposalData) {
      throw new Error('Failed to fetch proposal data')
    }

    // Get the seller email if available
    let sellerEmail = null
    if (proposalData.vehicle?.seller_id) {
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('email')
        .eq('id', proposalData.vehicle.seller_id)
        .single()

      if (!sellerError && sellerData?.email) {
        sellerEmail = sellerData.email
      }
    }

    // In a real production environment, you would send an email here
    // For now, we'll just log that we would send an email
    console.log('Would send email to:', sellerEmail || 'admin@example.com')
    console.log('Email subject: Nova proposta para veículo', proposalData.vehicle?.brand, proposalData.vehicle?.model)
    console.log('Email body would include:', proposalData.name, proposalData.email, proposalData.phone, proposalData.message)

    // Here you would integrate with an email service like SendGrid, Mailgun, etc.
    // For this example, we'll just return success

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
