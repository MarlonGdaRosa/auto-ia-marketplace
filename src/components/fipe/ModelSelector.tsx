
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { VehicleModel } from "@/services/vehicle/types";

interface ModelSelectorProps {
  models: VehicleModel[];
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  isLoading: boolean;
  isBrandSelected: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onModelChange,
  isLoading,
  isBrandSelected
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">
        Modelo <span className="text-red-500">*</span>
      </Label>
      <Select
        value={selectedModelId}
        onValueChange={onModelChange}
        disabled={isLoading || models.length === 0}
      >
        <SelectTrigger id="model" className="relative">
          <SelectValue placeholder={isBrandSelected ? (isLoading ? "Carregando modelos..." : "Selecione o modelo") : "Selecione a marca primeiro"} />
          {isLoading && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </SelectTrigger>
        <SelectContent>
          {models.length > 0 ? (
            models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.nome}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              {isBrandSelected ? (isLoading ? "Carregando modelos..." : "Nenhum modelo encontrado") : "Selecione uma marca primeiro"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
