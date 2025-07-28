import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Store, Mail, Phone, MapPin, Globe, Calendar, User, Hash, Search, MessageCircle } from 'lucide-react';
import { CustomFieldModal } from './CustomFieldModal';
import { CustomFieldRenderer } from './CustomFieldRenderer';

interface StoreSubmission {
  id: string;
  store_name: string;
  store_type: string;
  store_url?: string | null;
  cpf_cnpj?: string | null;
  email: string;
  phone?: string | null;
  cep?: string | null;
  state?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  custom_fields?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export function AdminPanel() {
  const [submissions, setSubmissions] = useState<StoreSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<StoreSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, startDate, endDate, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('store_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar os envios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filtro por range de datas
    if (startDate || endDate) {
      filtered = filtered.filter(submission => {
        // Converter a data do submission para o fuso horário local
        const submissionDate = new Date(submission.created_at);
        const localSubmissionDate = new Date(submissionDate.getTime() - submissionDate.getTimezoneOffset() * 60000);
        const submissionDateOnly = localSubmissionDate.toISOString().split('T')[0];

        let inRange = true;

        if (startDate) {
          inRange = inRange && submissionDateOnly >= startDate;
        }

        if (endDate) {
          inRange = inRange && submissionDateOnly <= endDate;
        }

        return inRange;
      });
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('store_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(submission => 
        submission.id === id ? { ...submission, status: newStatus } : submission
      ));

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status.",
        variant: "destructive",
      });
    }
  };

  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const getWhatsAppUrl = (phone: string) => {
    const cleanNumber = formatWhatsAppNumber(phone);
    return `https://api.whatsapp.com/send?phone=55${cleanNumber}&text=Ol%C3%A1%2C%20somos%20da%20Qagenda!%20Que%20bom%20ter%20encontrado%20em%20contato%20conosco%2C%20agora%2C%20posso%20te%20mostrar%20nossos%20planos%3F`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sem contato':
        return 'bg-gray-500';
      case 'Em negociação':
        return 'bg-yellow-500';
      case 'Negócio Fechado':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const setQuickDateFilter = (type: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (type) {
      case 'today':
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        setStartDate(yesterdayStr);
        setEndDate(yesterdayStr);
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        const day = today.getDay();
        const diff = today.getDate() - day;
        startOfWeek.setDate(diff);
        const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
        setStartDate(startOfWeekStr);
        setEndDate(todayStr);
        break;
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
        setStartDate(startOfMonthStr);
        setEndDate(todayStr);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-teal-light/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando envios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-light/20 to-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-teal">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie os cadastros de lojas</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Custom Fields Management */}
        <CustomFieldModal onFieldsUpdate={() => {}} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-teal">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-full">
                  <Store className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
                  <p className="text-muted-foreground">Total de Lojas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-teal">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-accent rounded-full">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                   <p className="text-2xl font-bold text-foreground">
                     {submissions.filter(s => {
                       const today = new Date();
                       const todayDateOnly = today.toISOString().split('T')[0];
                       
                       const submissionDate = new Date(s.created_at);
                       const localSubmissionDate = new Date(submissionDate.getTime() - submissionDate.getTimezoneOffset() * 60000);
                       const submissionDateOnly = localSubmissionDate.toISOString().split('T')[0];
                       
                       return submissionDateOnly === todayDateOnly;
                     }).length}
                   </p>
                  <p className="text-muted-foreground">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-teal">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-secondary rounded-full">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(submissions.map(s => s.store_type)).size}
                  </p>
                  <p className="text-muted-foreground">Tipos Diferentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-teal mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Filtros rápidos */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Filtros rápidos:
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateFilter('today')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-3 h-3" />
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateFilter('yesterday')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-3 h-3" />
                    Ontem
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateFilter('thisWeek')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-3 h-3" />
                    Esta Semana
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateFilter('thisMonth')}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-3 h-3" />
                    Este Mês
                  </Button>
                </div>
              </div>

              {/* Filtros de data e status */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data de início:
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data de fim:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Filtrar por status:
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="Sem contato">Sem contato</SelectItem>
                      <SelectItem value="Em negociação">Em negociação</SelectItem>
                      <SelectItem value="Negócio Fechado">Negócio Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Cadastros Recebidos</h2>
            <div className="text-sm text-muted-foreground">
              {filteredSubmissions.length} de {submissions.length} envios
            </div>
          </div>
          
          {filteredSubmissions.length === 0 ? (
            <Card className="border-0 shadow-teal">
              <CardContent className="p-12 text-center">
                <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {submissions.length === 0 ? 'Nenhum cadastro encontrado' : 'Nenhum resultado encontrado'}
                </h3>
                <p className="text-muted-foreground">
                  {submissions.length === 0 ? 'Aguardando os primeiros envios do formulário.' : 'Tente ajustar os filtros de pesquisa.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="border-0 shadow-teal">
                   <CardHeader className="bg-gradient-to-r from-teal-light to-background">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-gradient-primary rounded-lg">
                           <Store className="w-5 h-5 text-primary-foreground" />
                         </div>
                         <div>
                           <CardTitle className="text-xl">{submission.store_name}</CardTitle>
                           <CardDescription className="flex items-center gap-2">
                             <Badge variant="secondary">{submission.store_type}</Badge>
                             <span className="text-sm text-muted-foreground">
                               {formatDate(submission.created_at)}
                             </span>
                           </CardDescription>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <Select value={submission.status} onValueChange={(value) => updateStatus(submission.id, value)}>
                           <SelectTrigger className="w-40">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Sem contato">Sem contato</SelectItem>
                             <SelectItem value="Em negociação">Em negociação</SelectItem>
                             <SelectItem value="Negócio Fechado">Negócio Fechado</SelectItem>
                           </SelectContent>
                         </Select>
                         <Badge className={`${getStatusColor(submission.status)} text-white`}>
                           {submission.status}
                         </Badge>
                       </div>
                     </div>
                   </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Contato */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Contato
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {submission.email}
                          </p>
                           {submission.phone && (
                             <div className="flex items-center gap-2">
                               <Phone className="w-3 h-3 text-muted-foreground" />
                               <span>{submission.phone}</span>
                               <a
                                 href={getWhatsAppUrl(submission.phone)}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="ml-2 p-1 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                                 title="Enviar WhatsApp"
                               >
                                 <MessageCircle className="w-3 h-3 text-white" />
                               </a>
                             </div>
                           )}
                          {submission.cpf_cnpj && (
                            <p className="flex items-center gap-2">
                              <Hash className="w-3 h-3 text-muted-foreground" />
                              {submission.cpf_cnpj}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Endereço */}
                      {(submission.cep || submission.city || submission.state) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Endereço
                          </h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {submission.street && submission.number && (
                              <p>{submission.street}, {submission.number}</p>
                            )}
                            {submission.complement && <p>{submission.complement}</p>}
                            {submission.neighborhood && <p>{submission.neighborhood}</p>}
                            {submission.city && submission.state && (
                              <p>{submission.city} - {submission.state}</p>
                            )}
                            {submission.cep && <p>CEP: {submission.cep}</p>}
                          </div>
                        </div>
                      )}

                      {/* URL e Dados Extras */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          Informações Extras
                        </h4>
                        <div className="space-y-2 text-sm">
                          {submission.store_url && (
                            <p className="flex items-center gap-2">
                              <Globe className="w-3 h-3 text-muted-foreground" />
                              /loja/{submission.store_url}
                            </p>
                          )}
                           <CustomFieldRenderer customFields={submission.custom_fields || {}} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}