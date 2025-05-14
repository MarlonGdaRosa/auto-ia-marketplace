import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterOptions } from "@/types";
import { getStates, getCities, getBrands, getModels } from "@/services/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import {
  Search,
  Car,
  Map,
  Settings,
  Fuel,
  Filter,
  X,
} from "lucide-react";

interface VehicleFilterProps {
  initialFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const VehicleFilter: React.FC<VehicleFilterProps> = ({
  initialFilters,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, new Date().getFullYear()]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  // Queries for external data
  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: getStates
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => selectedState ? getCities(selectedState) : Promise.resolve([]),
    enabled: !!selectedState
  });

  const { data: brands = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands()
  });

  const { data: models = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ['models', selectedBrand],
    queryFn: () => selectedBrand && selectedBrand !== "all" ? getModels(selectedBrand) : Promise.resolve([]),
    enabled: !!selectedBrand && selectedBrand !== "all"
  });

  useEffect(() => {
    // When component mounts, set search from initial filters
    if (initialFilters.search) {
      setSearch(initialFilters.search);
    }
    
    // Set initial ranges if they exist in filters
    if (initialFilters.minPrice !== undefined || initialFilters.maxPrice !== undefined) {
      setPriceRange([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 500000
      ]);
    }
    
    if (initialFilters.minYear !== undefined || initialFilters.maxYear !== undefined) {
      setYearRange([
        initialFilters.minYear || 2010,
        initialFilters.maxYear || new Date().getFullYear()
      ]);
    }

    // Set selected brand if it exists in filters
    if (initialFilters.brand && brands && brands.length > 0) {
      const brandItem = brands.find((b: any) => b.nome === initialFilters.brand);
      if (brandItem) {
        setSelectedBrand(brandItem.id);
      }
    }
  }, [initialFilters, brands]);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: any
  ) => {
    const newFilters = { ...filters, [key]: value };
    
    // Handle special case for state selection
    if (key === "state" && value !== filters.state) {
      newFilters.city = undefined; // Reset city when state changes
      
      // Fix the type issue by ensuring we're setting a string
      if (value && value !== "all") {
        const stateObj = states.find((s: any) => s.sigla === value);
        setSelectedState(stateObj ? stateObj.id.toString() : "");
      } else {
        setSelectedState("");
      }
    }

    // Handle special case for brand selection
    if (key === "brand" && value !== filters.brand) {
      newFilters.model = undefined; // Reset model when brand changes
      if (brands && brands.length > 0) {
        const brandItem = brands.find((b: any) => b.nome === value);
        setSelectedBrand(brandItem?.id || "");
      }
    }

    setFilters(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setFilters({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  const handleYearChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
    setFilters({
      ...filters,
      minYear: value[0],
      maxYear: value[1]
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search });
    onFilterChange({ ...filters, search });
  };

  const handleClearFilters = () => {
    setSearch("");
    setPriceRange([0, 500000]);
    setYearRange([2010, new Date().getFullYear()]);
    setSelectedState("");
    setSelectedBrand("");
    setFilters({});
    onFilterChange({});
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="rounded-lg bg-white shadow-sm p-4">
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por marca ou modelo..."
            className="pl-10 pr-16"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 h-8"
          >
            Buscar
          </Button>
        </form>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-1.5" />
          <h3 className="font-medium">Filtros</h3>
        </div>
        {Object.keys(filters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-500 hover:text-red-600"
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-1.5 text-gray-500" />
            <Label>Marca</Label>
          </div>
          <Select
            value={filters.brand || ""}
            onValueChange={(value) => handleFilterChange("brand", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas as marcas</SelectItem>
                {Array.isArray(brands) && brands.map((brand: any) => (
                  <SelectItem key={brand.id} value={brand.nome}>
                    {brand.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {filters.brand && (
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Select
              value={filters.model || ""}
              onValueChange={(value) => handleFilterChange("model", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os modelos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  {Array.isArray(models) && models.map((model: any) => (
                    <SelectItem key={model.id} value={model.nome}>
                      {model.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center">
            <Map className="h-4 w-4 mr-1.5 text-gray-500" />
            <Label>Estado</Label>
          </div>
          <Select
            value={filters.state || ""}
            onValueChange={(value) => handleFilterChange("state", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os estados</SelectItem>
                {Array.isArray(states) && states.map((state: any) => (
                  <SelectItem key={state.id} value={state.sigla}>
                    {state.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {filters.state && (
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Select
              value={filters.city || ""}
              onValueChange={(value) => handleFilterChange("city", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {Array.isArray(cities) && cities.map((city: any) => (
                    <SelectItem key={city.id} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1.5 text-gray-500" />
            <Label>Câmbio</Label>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filters.transmission === "automatic" ? "default" : "outline"} 
              size="sm" 
              className="flex-1"
              onClick={() => handleFilterChange("transmission", filters.transmission === "automatic" ? undefined : "automatic")}
            >
              Automático
            </Button>
            <Button 
              variant={filters.transmission === "manual" ? "default" : "outline"} 
              size="sm" 
              className="flex-1"
              onClick={() => handleFilterChange("transmission", filters.transmission === "manual" ? undefined : "manual")}
            >
              Manual
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1.5 text-gray-500" />
            <Label>Combustível</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={filters.fuel?.includes("flex") ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                const currentFuels = filters.fuel || [];
                const newFuels = currentFuels.includes("flex")
                  ? currentFuels.filter(f => f !== "flex")
                  : [...currentFuels, "flex"];
                handleFilterChange("fuel", newFuels.length ? newFuels : undefined);
              }}
            >
              Flex
            </Button>
            <Button 
              variant={filters.fuel?.includes("gasoline") ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                const currentFuels = filters.fuel || [];
                const newFuels = currentFuels.includes("gasoline")
                  ? currentFuels.filter(f => f !== "gasoline")
                  : [...currentFuels, "gasoline"];
                handleFilterChange("fuel", newFuels.length ? newFuels : undefined);
              }}
            >
              Gasolina
            </Button>
            <Button 
              variant={filters.fuel?.includes("diesel") ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                const currentFuels = filters.fuel || [];
                const newFuels = currentFuels.includes("diesel")
                  ? currentFuels.filter(f => f !== "diesel")
                  : [...currentFuels, "diesel"];
                handleFilterChange("fuel", newFuels.length ? newFuels : undefined);
              }}
            >
              Diesel
            </Button>
            <Button 
              variant={filters.fuel?.includes("electric") ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                const currentFuels = filters.fuel || [];
                const newFuels = currentFuels.includes("electric")
                  ? currentFuels.filter(f => f !== "electric")
                  : [...currentFuels, "electric"];
                handleFilterChange("fuel", newFuels.length ? newFuels : undefined);
              }}
            >
              Elétrico
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Preço</span>
            <span className="text-sm text-gray-500">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </span>
          </Label>
          <Slider
            min={0}
            max={500000}
            step={5000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Ano</span>
            <span className="text-sm text-gray-500">
              {yearRange[0]} - {yearRange[1]}
            </span>
          </Label>
          <Slider
            min={2000}
            max={new Date().getFullYear()}
            step={1}
            value={yearRange}
            onValueChange={handleYearChange}
            className="py-4"
          />
        </div>

        <Button className="w-full mt-2" onClick={handleApplyFilters}>
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
};

export default VehicleFilter;
