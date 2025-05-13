
import React from "react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FipePrice } from "@/services/vehicle/types";

interface FipePriceDisplayProps {
  fipePrice: FipePrice | null;
  isLoading: boolean;
}

const FipePriceDisplay: React.FC<FipePriceDisplayProps> = ({ fipePrice, isLoading }) => {
  if (isLoading) {
    return (
      <div className="col-span-1 md:col-span-3 flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Consultando tabela FIPE...</span>
      </div>
    );
  }

  if (!fipePrice) {
    return null;
  }

  return (
    <div className="col-span-1 md:col-span-3 space-y-2 bg-muted p-3 rounded-md">
      <Label>Valor FIPE</Label>
      <div className="text-xl font-semibold">{fipePrice.preco}</div>
      <div className="text-sm text-muted-foreground">
        {fipePrice.marca} {fipePrice.modelo} {fipePrice.anoModelo} - {fipePrice.combustivel}
      </div>
      {fipePrice.mesReferencia && (
        <div className="text-xs text-muted-foreground">
          Ref: {fipePrice.mesReferencia}
        </div>
      )}
    </div>
  );
};

export default FipePriceDisplay;
