
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProposalForm from "@/components/ProposalForm";
import { getVehicleById, getSellerById } from "@/services/supabaseService";
import { formatCurrency, formatPhone, formatMileage } from "@/lib/format";
import {
  Calendar,
  MapPin,
  Gauge,
  Settings,
  Fuel,
  Check,
  User,
  Phone,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id || ""),
    enabled: !!id
  });
  
  const { data: seller, isLoading: isLoadingSeller } = useQuery({
    queryKey: ['seller', vehicle?.sellerId],
    queryFn: () => getSellerById(vehicle?.sellerId || ""),
    enabled: !!vehicle?.sellerId
  });
  
  if (isLoadingVehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-brand-blue animate-spin mb-4" />
            <p className="text-gray-600">Carregando detalhes do veículo...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Veículo não encontrado</h2>
            <p className="text-gray-500 mb-6">
              O veículo que você está procurando não está disponível ou foi removido.
            </p>
            <Link to="/">
              <Button>Voltar para a página inicial</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const getFuelIcon = (fuel: string) => {
    switch (fuel) {
      case "gasoline":
        return "Gasolina";
      case "ethanol":
        return "Etanol";
      case "diesel":
        return "Diesel";
      case "electric":
        return "Elétrico";
      case "hybrid":
        return "Híbrido";
      case "flex":
        return "Flex";
      default:
        return fuel;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-brand-blue hover:underline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para resultados
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <img
                  src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {vehicle.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex
                              ? "bg-brand-blue"
                              : "bg-gray-300"
                          }`}
                          onClick={() => setCurrentImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {vehicle.status !== "available" && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={vehicle.status === "sold" ? "destructive" : "secondary"}
                      className={cn(
                        "text-white py-1 px-3 text-sm",
                        vehicle.status === "sold" 
                          ? "bg-red-500" 
                          : "bg-amber-500"
                      )}
                    >
                      {vehicle.status === "sold" ? "Vendido" : "Reservado"}
                    </Badge>
                  </div>
                )}
              </div>

              {vehicle.images.length > 1 && (
                <div className="p-2 grid grid-cols-6 gap-2">
                  {vehicle.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-video rounded overflow-hidden ${
                        idx === currentImageIndex
                          ? "ring-2 ring-brand-blue"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.brand} ${vehicle.model} - Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-1">
                {vehicle.brand} {vehicle.model}
              </h2>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {vehicle.location.city}, {vehicle.location.state}
                  {vehicle.location.region && ` - ${vehicle.location.region}`}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="font-semibold">{vehicle.year}</span>
                  <span className="text-xs text-gray-500">Ano</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="font-semibold">
                    {formatMileage(vehicle.mileage)}
                  </span>
                  <span className="text-xs text-gray-500">Quilometragem</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="font-semibold">
                    {vehicle.transmission === "automatic" ? "Automático" : "Manual"}
                  </span>
                  <span className="text-xs text-gray-500">Câmbio</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="font-semibold">{getFuelIcon(vehicle.fuel)}</span>
                  <span className="text-xs text-gray-500">Combustível</span>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold mb-3">Características</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <Check className="h-4 w-4 text-brand-blue mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold mb-3">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
            </div>
          </div>

          {/* Right column - Contact and price info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(vehicle.price)}
                </h3>
              </div>

              <div className="space-y-3">
                <ProposalForm vehicle={vehicle} buttonVariant="default" buttonFullWidth />
                
                {/* WhatsApp button */}
                <Button variant="outline" className="w-full bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
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
                  Conversar via WhatsApp
                </Button>
              </div>
            </div>

            {isLoadingSeller ? (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-gray-200 p-4 rounded-full"></div>
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : seller ? (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Informações do vendedor</h3>

                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.city}, {seller.state}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {formatPhone(seller.phone)}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetails;
