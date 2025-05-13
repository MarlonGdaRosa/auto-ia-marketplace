
import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Gauge,
  Settings,
  Fuel,
  ArrowRight
} from "lucide-react";
import { Vehicle } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
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
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={vehicle.images[0] || "/placeholder.svg"} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          className="w-full h-full object-cover"
        />
        {vehicle.status === "sold" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-1.5">Vendido</Badge>
          </div>
        )}
        {vehicle.status === "reserved" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="warning" className="text-lg py-1.5 bg-amber-500">Reservado</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-lg">{vehicle.brand} {vehicle.model}</h3>
          <p className="font-bold text-lg text-brand-blue">{formatCurrency(vehicle.price)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>{vehicle.transmission === "automatic" ? "Automático" : "Manual"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{getFuelIcon(vehicle.fuel)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{vehicle.location.city}, {vehicle.location.state}</span>
        </div>
        
        <Link 
          to={`/vehicle/${vehicle.id}`}
          className="flex items-center justify-center gap-1 w-full bg-brand-blue text-white p-2 rounded-md hover:bg-brand-blue-dark transition-colors"
        >
          Ver detalhes 
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
