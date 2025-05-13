
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getProposals, updateProposalStatus } from "@/services/supabaseService";
import { Proposal } from "@/types";
import { formatDate, formatPhone } from "@/lib/format";
import { Loader2, Phone, Mail, ArrowRightLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ProposalStatus = {
  PENDING: "pending",
  CONTACTED: "contacted",
  CLOSED: "closed",
};

const Proposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProposals();
  }, []);

  useEffect(() => {
    filterProposals(activeTab, searchTerm);
  }, [proposals, activeTab, searchTerm]);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (error) {
      console.error("Error loading proposals:", error);
      toast.error("Erro ao carregar propostas");
    } finally {
      setLoading(false);
    }
  };

  const filterProposals = (tab: string, search: string) => {
    let filtered = [...proposals];

    // Filter by tab
    if (tab !== "all") {
      filtered = filtered.filter((p) => p.status === tab);
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.phone.includes(term) ||
          (p.vehicle && p.vehicle.brand.toLowerCase().includes(term)) ||
          (p.vehicle && p.vehicle.model.toLowerCase().includes(term))
      );
    }

    setFilteredProposals(filtered);
  };

  const handleStatusChange = async (proposalId: string, status: string) => {
    setUpdating({ ...updating, [proposalId]: true });
    try {
      const success = await updateProposalStatus(proposalId, status);
      if (success) {
        setProposals(
          proposals.map((p) =>
            p.id === proposalId ? { ...p, status } : p
          )
        );
        toast.success("Status atualizado com sucesso");
      } else {
        throw new Error("Falha ao atualizar status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdating({ ...updating, [proposalId]: false });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ProposalStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        );
      case ProposalStatus.CONTACTED:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Contactado
          </Badge>
        );
      case ProposalStatus.CLOSED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Concluído
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const openWhatsApp = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phoneNumber}`, "_blank");
  };

  const mailTo = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (loading) {
    return (
      <AdminLayout title="Propostas">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Propostas">
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar proposta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs pr-8"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            Todas ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value={ProposalStatus.PENDING}>
            Pendentes ({proposals.filter((p) => p.status === ProposalStatus.PENDING).length})
          </TabsTrigger>
          <TabsTrigger value={ProposalStatus.CONTACTED}>
            Contactados ({proposals.filter((p) => p.status === ProposalStatus.CONTACTED).length})
          </TabsTrigger>
          <TabsTrigger value={ProposalStatus.CLOSED}>
            Concluídos ({proposals.filter((p) => p.status === ProposalStatus.CLOSED).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-2">
          {filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 h-40">
                <p className="text-gray-500 text-center">Nenhuma proposta encontrada</p>
                <p className="text-sm text-gray-400 text-center">
                  {searchTerm 
                    ? "Tente outros termos de busca"
                    : "As propostas enviadas pelos clientes irão aparecer aqui"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden">
                  <div className="bg-gray-100 p-3 flex justify-between items-center border-b">
                    <div>
                      <h3 className="font-medium">
                        {proposal.vehicle?.brand} {proposal.vehicle?.model}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {proposal.vehicle?.year} • Proposta de {formatDate(proposal.created_at || '')}
                      </p>
                    </div>
                    {getStatusBadge(proposal.status || 'pending')}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h4 className="font-medium">{proposal.name}</h4>
                      <div className="flex flex-col gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 flex items-center justify-center"
                          onClick={() => openWhatsApp(proposal.phone)}
                        >
                          <Phone className="h-3 w-3 mr-2" />
                          {formatPhone(proposal.phone)}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center"
                          onClick={() => mailTo(proposal.email)}
                        >
                          <Mail className="h-3 w-3 mr-2" />
                          {proposal.email}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {proposal.message}
                      </p>
                    </div>

                    <div className="mt-4 border-t pt-3 flex gap-2">
                      {proposal.status === ProposalStatus.PENDING && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleStatusChange(proposal.id, ProposalStatus.CONTACTED)
                          }
                          disabled={updating[proposal.id]}
                        >
                          {updating[proposal.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <ArrowRightLeft className="h-4 w-4 mr-1" />
                          )}
                          Contactado
                        </Button>
                      )}

                      {proposal.status === ProposalStatus.CONTACTED && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleStatusChange(proposal.id, ProposalStatus.CLOSED)
                          }
                          disabled={updating[proposal.id]}
                        >
                          {updating[proposal.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Concluir
                        </Button>
                      )}

                      {(proposal.status === ProposalStatus.CONTACTED ||
                        proposal.status === ProposalStatus.CLOSED) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(proposal.id, ProposalStatus.PENDING)
                          }
                          disabled={updating[proposal.id]}
                        >
                          {updating[proposal.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <X className="h-4 w-4 mr-1" />
                          )}
                          Reverter
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Proposals;
