import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Store, MapPin, Mail, Phone, Building, Globe, Hash, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { useCustomFields } from '@/hooks/useCustomFields';

const storeTypes = [
  'Beleza e Estética',
  'Saúde e Bem-estar',
  'Automotivo',
  'Tecnologia',
  'Educação',
  'Alimentação',
  'Moda e Vestuário',
  'Casa e Decoração',
  'Esportes e Lazer',
  'Serviços Gerais',
  'Outros'
];

export function StoreForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    store_type: '',
    store_url: '',
    cpf_cnpj: '',
    email: '',
    phone: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: ''
  });
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});
  const { customFields, loading: customFieldsLoading } = useCustomFields();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (fieldKey: string, value: any) => {
    setCustomFieldsData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const validateCustomFields = () => {
    const requiredFields = customFields.filter(field => field.is_required);
    for (const field of requiredFields) {
      if (!customFieldsData[field.field_key] || customFieldsData[field.field_key].toString().trim() === '') {
        return false;
      }
    }
    return true;
  };

  const renderCustomField = (field: any) => {
    const commonProps = {
      id: field.field_key,
      value: customFieldsData[field.field_key] || '',
      onChange: (e: any) => handleCustomFieldChange(field.field_key, e.target.value),
      placeholder: field.field_name,
      required: field.is_required,
      className: "border-teal-primary/20 focus:border-teal-primary"
    };

    switch (field.field_type) {
      case 'email':
        return <Input {...commonProps} type="email" />;
      case 'number':
        return <Input {...commonProps} type="number" />;
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />;
      case 'select':
        return (
          <Select
            value={customFieldsData[field.field_key] || ''}
            onValueChange={(value) => handleCustomFieldChange(field.field_key, value)}
          >
            <SelectTrigger className="border-teal-primary/20 focus:border-teal-primary">
              <SelectValue placeholder={`Selecione ${field.field_name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.store_name || !formData.store_type || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!validateCustomFields()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos personalizados obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        custom_fields: Object.keys(customFieldsData).length > 0 ? customFieldsData : null
      };

      const { error } = await supabase
        .from('store_submissions')
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });

      // Reset form
      setFormData({
        store_name: '',
        store_type: '',
        store_url: '',
        cpf_cnpj: '',
        email: '',
        phone: '',
        cep: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: '',
        complement: ''
      });
      setCustomFieldsData({});
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-light/20 to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Admin Button */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-teal">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Portal de Cadastro</h1>
          <p className="text-muted-foreground text-lg">Registre sua loja e expanda seus negócios</p>
        </div>

        <Card className="shadow-teal border-0">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl">Informações da Loja</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Preencha os dados da sua loja para cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store_name" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Nome da Loja *
                  </Label>
                  <Input
                    id="store_name"
                    value={formData.store_name}
                    onChange={(e) => handleInputChange('store_name', e.target.value)}
                    placeholder="Ex: Salão da Maria"
                    required
                    className="border-teal-primary/20 focus:border-teal-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_type" className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    Tipo da Loja *
                  </Label>
                  <Select value={formData.store_type} onValueChange={(value) => handleInputChange('store_type', value)}>
                    <SelectTrigger className="border-teal-primary/20 focus:border-teal-primary">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contato */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj" className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    CPF
                  </Label>
                  <InputMask
                    mask="999.999.999-99"
                    value={formData.cpf_cnpj}
                    onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        id="cpf_cnpj"
                        placeholder="000.000.000-00"
                        className="border-teal-primary/20 focus:border-teal-primary"
                      />
                    )}
                  </InputMask>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@salao.com"
                    required
                    className="border-teal-primary/20 focus:border-teal-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Telefone *
                  </Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        id="phone"
                        placeholder="(11) 99999-9999"
                        required
                        className="border-teal-primary/20 focus:border-teal-primary"
                      />
                    )}
                  </InputMask>
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="store_url" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Site da Loja
                </Label>
                <Input
                  id="store_url"
                  value={formData.store_url}
                  onChange={(e) => handleInputChange('store_url', e.target.value)}
                  placeholder="https://www.sualoja.com.br"
                  className="border-teal-primary/20 focus:border-teal-primary"
                />
              </div>

              {/* Custom Fields */}
              {!customFieldsLoading && customFields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Informações Adicionais</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.field_key} className="flex items-center gap-1">
                          {field.field_name}
                          {field.is_required && <span className="text-destructive">*</span>}
                        </Label>
                        {renderCustomField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Endereço */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Endereço</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <div className="flex gap-2">
                      <InputMask
                        mask="99999-999"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            id="cep"
                            placeholder="00000-000"
                            className="border-teal-primary/20 focus:border-teal-primary"
                          />
                        )}
                      </InputMask>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="SC"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Camboriú"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Ex: Centro"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Rua/Logradouro</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Ex: Rua das Flores"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      placeholder="Ex: 123"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      placeholder="Ex: Apto 45"
                      className="border-teal-primary/20 focus:border-teal-primary"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-accent hover:opacity-90 text-accent-foreground font-semibold py-3 text-lg"
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Loja'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}