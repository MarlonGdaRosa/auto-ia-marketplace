
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { proposals } from "@/services/mockData";
import { formatDateTime, formatPhone } from "@/lib/format";
import { Search, Mail, Phone, Trash2, MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Proposals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call
    toast.success(`Proposta #${id} excluída com sucesso`);
  };

  const handleUpdateStatus = (id: string, status: "pending" | "contacted" | "closed") => {
    // In a real app, this would make an API call
    toast.success(`Status da proposta atualizado para ${
      status === "pending" ? "Pendente" : status === "contacted" ? "Contatado" : "Fechado"
    }`);
  };

  const viewDetails = (proposal: typeof proposals[0]) => {
    setSelectedProposal(proposal);
    setIsDialogOpen(true);
  };

  const mailTo = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const callPhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const whatsApp = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phoneNumber}`, "_blank");
  };

  const filteredProposals = proposals.filter((proposal) => {
    // Filter by search term
    const searchMatch = `${proposal.name} ${proposal.vehicleInfo.brand} ${proposal.vehicleInfo.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by status
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "pending" && proposal.status === "pending") ||
      (statusFilter === "contacted" && proposal.status === "contacted") ||
      (statusFilter === "closed" && proposal.status === "closed");

    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pendente
          </Badge>
        );
      case "contacted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Contatado
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Fechado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Propostas Recebidas">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar proposta..."
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
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="contacted">Contatados</SelectItem>
              <SelectItem value="closed">Fechados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Nenhuma proposta encontrada</p>
                    <p className="text-sm text-gray-400">
                      Tente ajustar os filtros
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.name}</TableCell>
                  <TableCell>
                    {proposal.vehicleInfo.brand} {proposal.vehicleInfo.model} (
                    {proposal.vehicleInfo.year})
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => callPhone(proposal.phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => mailTo(proposal.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(proposal.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => viewDetails(proposal)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir proposta</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a proposta de{" "}
                              <strong>{proposal.name}</strong>? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(proposal.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProposal && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Proposta</DialogTitle>
              <DialogDescription>
                Proposta para {selectedProposal.vehicleInfo.brand}{" "}
                {selectedProposal.vehicleInfo.model} ({selectedProposal.vehicleInfo.year})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Informações do Cliente</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{selectedProposal.name}</p>
                  <p className="text-sm text-gray-600">{selectedProposal.email}</p>
                  <p className="text-sm text-gray-600">
                    {formatPhone(selectedProposal.phone)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Mensagem</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{selectedProposal.message}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Status</h4>
                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedProposal.status === "pending" ? "default" : "outline"
                    }
                    size="sm"
                    className={
                      selectedProposal.status === "pending"
                        ? "bg-blue-600"
                        : "border-blue-200 text-blue-600"
                    }
                    onClick={() => handleUpdateStatus(selectedProposal.id, "pending")}
                  >
                    Pendente
                  </Button>
                  <Button
                    variant={
                      selectedProposal.status === "contacted" ? "default" : "outline"
                    }
                    size="sm"
                    className={
                      selectedProposal.status === "contacted"
                        ? "bg-green-600"
                        : "border-green-200 text-green-600"
                    }
                    onClick={() => handleUpdateStatus(selectedProposal.id, "contacted")}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Contatado
                  </Button>
                  <Button
                    variant={
                      selectedProposal.status === "closed" ? "default" : "outline"
                    }
                    size="sm"
                    className={
                      selectedProposal.status === "closed"
                        ? "bg-gray-600"
                        : "border-gray-200 text-gray-600"
                    }
                    onClick={() => handleUpdateStatus(selectedProposal.id, "closed")}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Fechado
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 flex-1"
                onClick={() => whatsApp(selectedProposal.phone)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => mailTo(selectedProposal.email)}
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
};

export default Proposals;
