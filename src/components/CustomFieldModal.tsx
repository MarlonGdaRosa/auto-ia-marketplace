import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomFieldDefinition {
  id: string;
  field_name: string;
  field_key: string;
  field_type: string;
  field_options?: any;
  is_required: boolean;
  display_order: number;
}

interface CustomFieldModalProps {
  onFieldsUpdate: () => void;
}

export const CustomFieldModal = ({ onFieldsUpdate }: CustomFieldModalProps) => {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<CustomFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newField, setNewField] = useState({
    field_name: '',
    field_key: '',
    field_type: 'text',
    field_options: [] as string[],
    is_required: false,
  });
  const [optionsInput, setOptionsInput] = useState('');
  const { toast } = useToast();

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_field_definitions')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Erro ao buscar campos:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar campos personalizados',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchFields();
    }
  }, [open]);

  const generateFieldKey = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleFieldNameChange = (value: string) => {
    setNewField(prev => ({
      ...prev,
      field_name: value,
      field_key: generateFieldKey(value),
    }));
  };

  const handleAddField = async () => {
    if (!newField.field_name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do campo é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const fieldOptions = newField.field_type === 'select' 
        ? optionsInput.split('\n').filter(opt => opt.trim()) 
        : null;

      const { error } = await supabase
        .from('custom_field_definitions')
        .insert({
          field_name: newField.field_name,
          field_key: newField.field_key,
          field_type: newField.field_type,
          field_options: fieldOptions,
          is_required: newField.is_required,
          display_order: fields.length,
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Campo personalizado adicionado',
      });

      setNewField({
        field_name: '',
        field_key: '',
        field_type: 'text',
        field_options: [],
        is_required: false,
      });
      setOptionsInput('');
      fetchFields();
      onFieldsUpdate();
    } catch (error) {
      console.error('Erro ao adicionar campo:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar campo personalizado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_field_definitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Campo removido',
      });

      fetchFields();
      onFieldsUpdate();
    } catch (error) {
      console.error('Erro ao remover campo:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao remover campo',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Campo Personalizado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Campos Personalizados</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Field Form */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Campo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="field_name">Nome do Campo</Label>
                <Input
                  id="field_name"
                  value={newField.field_name}
                  onChange={(e) => handleFieldNameChange(e.target.value)}
                  placeholder="Nome do campo"
                />
              </div>

              <div>
                <Label htmlFor="field_key">Chave do Campo</Label>
                <Input
                  id="field_key"
                  value={newField.field_key}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="field_type">Tipo do Campo</Label>
                <Select 
                  value={newField.field_type} 
                  onValueChange={(value: any) => setNewField(prev => ({ ...prev, field_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="textarea">Texto Longo</SelectItem>
                    <SelectItem value="select">Lista de Opções</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newField.field_type === 'select' && (
                <div>
                  <Label htmlFor="options">Opções (uma por linha)</Label>
                  <Textarea
                    id="options"
                    value={optionsInput}
                    onChange={(e) => setOptionsInput(e.target.value)}
                    placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={newField.is_required}
                  onCheckedChange={(checked) => setNewField(prev => ({ ...prev, is_required: checked }))}
                />
                <Label htmlFor="is_required">Campo obrigatório</Label>
              </div>

              <Button onClick={handleAddField} disabled={isLoading}>
                {isLoading ? 'Adicionando...' : 'Adicionar Campo'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Fields List */}
          {fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campos Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{field.field_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.field_type} • {field.is_required ? 'Obrigatório' : 'Opcional'}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
