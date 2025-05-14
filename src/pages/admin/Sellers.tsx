
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { formatDate, formatPhone } from "@/lib/format";
import { Plus, Search, Mail, Phone, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSellers, createSeller, deleteSeller } from "@/services/supabaseService";
import { Seller } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStates, getCities } from "@/services/vehicleAPI";
import { IBGEState, IBGECity } from "@/services/vehicle/types";

// Phone mask utility function
const applyPhoneMask = (value: string): string => {
  if (!value) return '';
  
  // Remove non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  // Apply mask (99) 99999-9999
  if (numericValue.length <= 11) {
    if (numericValue.length <= 2) {
      return numericValue;
    }
    if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    }
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  }
  
  return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
};

const Sellers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const queryClient = useQueryClient();

  // Fetch states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await getStates();
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Erro ao carregar estados");
      }
    };
    
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state) {
        setCities([]);
        return;
      }
      
      try {
        const citiesData = await getCities(formData.state);
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Erro ao carregar cidades");
      }
    };
    
    fetchCities();
  }, [formData.state]);

  const { data: sellers = [], isLoading, error } = useQuery({
    queryKey: ["sellers"],
    queryFn: getSellers,
  });

  const createSellerMutation = useMutation({
    mutationFn: createSeller,
    onSuccess: () => {
      toast.success("Vendedor cadastrado com sucesso!");
      setDialogOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        state: "",
      });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao cadastrar vendedor: ${error.message}`);
    }
  });

  const deleteSellerMutation = useMutation({
    mutationFn: deleteSeller,
    onSuccess: () => {
      toast.success("Vendedor excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir vendedor: ${error.message}`);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.city || !formData.state) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // Remove mask from phone before sending to API
    const submissionData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '')
    };
    
    createSellerMutation.mutate(submissionData);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting seller with ID:", id);
    deleteSellerMutation.mutate(id);
  };

  const filteredSellers = sellers.filter((seller) =>
    `${seller.name} ${seller.city} ${seller.state}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const openWhatsApp = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phoneNumber}`, "_blank");
  };

  const mailTo = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (error) {
    console.error("Error loading sellers:", error);
    toast.error("Erro ao carregar vendedores");
  }

  return (
    <AdminLayout title="Vendedores">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar vendedor..."
            className="w-full md:w-80 pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Vendedor</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo vendedor abaixo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(99) 99999-9999"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Selecione</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.sigla}>
                          {state.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled={!formData.state || cities.length === 0}
                      required
                    >
                      <option value="">Selecione</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.nome}>
                          {city.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createSellerMutation.isPending}>
                  {createSellerMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="col-span-full">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 h-40">
              <User className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">Nenhum vendedor encontrado</p>
              <p className="text-sm text-gray-400 text-center">
                Tente ajustar sua busca ou adicione um novo vendedor
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id_seller}>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{formatPhone(seller.phone)}</TableCell>
                  <TableCell>{seller.city}</TableCell>
                  <TableCell>{seller.state}</TableCell>
                  <TableCell>{seller.email || "-"}</TableCell>
                  <TableCell>{formatDate(seller.created_at || "")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openWhatsApp(seller.phone)}
                        title="WhatsApp"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      {seller.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => mailTo(seller.email!)}
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir vendedor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o vendedor {seller.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(seller.id_seller)}
                              className="bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Sellers;
