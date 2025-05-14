import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { getVehicles, deleteVehicle } from "@/services/supabaseService";
import { Vehicle } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Plus, Edit, Trash2, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterAndSortVehicles();
  }, [vehicles, statusFilter, searchTerm, sortField, sortDirection]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles();
      console.log("Loaded vehicles from Supabase:", data);
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          `${v.brand} ${v.model} ${v.year}`
            .toLowerCase()
            .includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];

      if (sortField === "price" || sortField === "year" || sortField === "mileage") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortField === "brand") {
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
      }

      if (sortField === "model") {
        aValue = a.model.toLowerCase();
        bValue = b.model.toLowerCase();
      }

      if (sortField === "location") {
        aValue = a.location.city.toLowerCase();
        bValue = b.location.city.toLowerCase();
      }

      if (sortField === "created_at") {
        aValue = new Date(a.created_at || '');
        bValue = new Date(b.created_at || '');
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredVehicles(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      // Chamada real para excluir o veículo
      await deleteVehicle(id);
      
      // Após exclusão bem-sucedida, recarregar veículos
      await loadVehicles();
      
      toast.success(`Veículo excluído com sucesso`);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Erro ao excluir veículo");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Disponível
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Vendido
          </Badge>
        );
      case "reserved":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Reservado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Veículos">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Veículos">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar veículo..."
              className="w-full md:w-80 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="available">Disponíveis</SelectItem>
              <SelectItem value="sold">Vendidos</SelectItem>
              <SelectItem value="reserved">Reservados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link to="/admin/vehicles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </Button>
        </Link>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Imagem</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("brand")}
              >
                <div className="flex items-center">
                  Marca
                  {sortField === "brand" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("model")}
              >
                <div className="flex items-center">
                  Modelo
                  {sortField === "model" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("year")}
              >
                <div className="flex items-center">
                  Ano
                  {sortField === "year" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Preço
                  {sortField === "price" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center">
                  Localização
                  {sortField === "location" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500">Nenhum veículo encontrado</p>
                    <p className="text-sm text-gray-400">
                      Tente ajustar os filtros ou adicione um novo veículo
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded-md">
                      <img
                        src={vehicle.images[0] || "/placeholder.svg"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{formatCurrency(vehicle.price)}</TableCell>
                  <TableCell>
                    {vehicle.location.city}, {vehicle.location.state}
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/vehicles/edit/${vehicle.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir veículo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o veículo{" "}
                              <strong>
                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                              </strong>
                              ? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(vehicle.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Vehicles;
