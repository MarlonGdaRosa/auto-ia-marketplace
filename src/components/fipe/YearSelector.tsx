
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
import { VehicleYear } from "@/services/vehicle/types";

interface YearSelectorProps {
  years: VehicleYear[];
  selectedYearId: string;
  onYearChange: (yearId: string) => void;
  isLoading: boolean;
  isModelSelected: boolean;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYearId,
  onYearChange,
  isLoading,
  isModelSelected
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="year">
        Ano <span className="text-red-500">*</span>
      </Label>
      <Select
        value={selectedYearId}
        onValueChange={onYearChange}
        disabled={isLoading || years.length === 0}
      >
        <SelectTrigger id="year" className="relative">
          <SelectValue placeholder={isModelSelected ? "Selecione o ano" : "Selecione o modelo primeiro"} />
          {isLoading && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </SelectTrigger>
        <SelectContent>
          {years.length > 0 ? (
            years.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.nome}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              {isModelSelected ? "Nenhum ano encontrado" : "Selecione um modelo primeiro"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
