
import React, { useState } from "react";
import { FilterOptions } from "@/types";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CheckIcon, Settings, Filter, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Mock data
const brands = [
  "Toyota", "Honda", "Ford", "Volkswagen", "Chevrolet", "Hyundai", "Fiat", "BMW", "Mercedes-Benz", "Audi", "Nissan"
];

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", 
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const cities = {
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "São José dos Campos"],
  "RJ": ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"]
};

interface VehicleFilterProps {
  initialFilters?: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const VehicleFilter: React.FC<VehicleFilterProps> = ({
  initialFilters = {},
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()]);
  const [search, setSearch] = useState("");

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleYearRangeChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = { ...filters, search };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const applyFilters = () => {
    const updatedFilters = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minYear: yearRange[0],
      maxYear: yearRange[1],
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setFilters(emptyFilters);
    setPriceRange([0, 500000]);
    setYearRange([2000, new Date().getFullYear()]);
    setSearch("");
    onFilterChange(emptyFilters);
  };

  const availableCities = (filters.state && filters.state in cities) 
    ? cities[filters.state as keyof typeof cities] 
    : [];

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== 'search' && filters[key as keyof FilterOptions] !== undefined
  );

  // Desktop filters
  const DesktopFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Buscar marca ou modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="brand-model">
          <AccordionTrigger>Marca e Modelo</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) => handleFilterChange("brand", value)}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Localização</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => handleFilterChange("state", value)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filters.state && (
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => handleFilterChange("city", value)}
                    disabled={!filters.state}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Preço</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">R$ {priceRange[0].toLocaleString()}</span>
                  <span className="text-sm">R$ {priceRange[1].toLocaleString()}</span>
                </div>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={500000}
                  step={1000}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceRangeChange}
                  className="my-4"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="year">
          <AccordionTrigger>Ano</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{yearRange[0]}</span>
                  <span className="text-sm">{yearRange[1]}</span>
                </div>
                <Slider
                  defaultValue={[yearRange[0], yearRange[1]]}
                  min={1990}
                  max={new Date().getFullYear()}
                  step={1}
                  value={[yearRange[0], yearRange[1]]}
                  onValueChange={handleYearRangeChange}
                  className="my-4"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Características</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Câmbio</Label>
                <Select
                  value={filters.transmission}
                  onValueChange={(value) => 
                    handleFilterChange("transmission", value as "manual" | "automatic")
                  }
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Selecione o câmbio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Combustível</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["gasoline", "ethanol", "diesel", "electric", "hybrid", "flex"].map((fuel) => {
                    const fuelLabels: Record<string, string> = {
                      gasoline: "Gasolina",
                      ethanol: "Etanol",
                      diesel: "Diesel",
                      electric: "Elétrico",
                      hybrid: "Híbrido",
                      flex: "Flex",
                    };

                    const isSelected = filters.fuel?.includes(fuel);

                    return (
                      <Button
                        key={fuel}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={cn("justify-start", isSelected && "bg-brand-blue text-white")}
                        onClick={() => {
                          const currentFuels = filters.fuel || [];
                          const newFuels = isSelected
                            ? currentFuels.filter((f) => f !== fuel)
                            : [...currentFuels, fuel];
                          handleFilterChange("fuel", newFuels);
                        }}
                      >
                        {isSelected && <CheckIcon className="h-4 w-4 mr-2" />}
                        {fuelLabels[fuel]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full" onClick={applyFilters}>
          Aplicar Filtros
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile filter button and drawer
  const MobileFilters = () => (
    <div className="fixed bottom-4 right-4 z-10 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="rounded-full h-12 w-12 shadow-lg">
            <Filter className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85%]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Ajuste os filtros para sua busca.</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <DesktopFilters />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <DesktopFilters />
      </div>
      <MobileFilters />
    </>
  );
};

export default VehicleFilter;
