
import React from "react";
import { Link } from "react-router-dom";
import { Vehicle } from "@/types";
import {
  Calendar,
  Gauge,
  MapPin,
  Settings,
  Fuel,
} from "lucide-react";
import { formatCurrency, formatMileage } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
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
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-[4/3] relative">
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
            <Badge variant="secondary" className="text-lg py-1.5 bg-amber-500 text-white">Reservado</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-semibold">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-xl font-bold text-brand-blue mb-2">
          {formatCurrency(vehicle.price)}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-1 text-gray-500" />
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1 text-gray-500" />
            <span>{vehicle.transmission === "automatic" ? "Auto" : "Manual"}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1 text-gray-500" />
            <span>{getFuelIcon(vehicle.fuel)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3 mt-auto">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">
            {vehicle.location.city}, {vehicle.location.state}
          </span>
        </div>
        <Link to={`/vehicle/${vehicle.id}`} className="block">
          <button className="w-full py-2 px-4 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition">
            Ver detalhes
          </button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
