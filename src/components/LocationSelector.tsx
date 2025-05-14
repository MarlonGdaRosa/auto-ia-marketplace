
import React, { useState, useEffect } from "react";
import { getStates, getCities } from "@/services/vehicle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { IBGEState, IBGECity } from "@/services/vehicle/types";

interface LocationSelectorProps {
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  initialState?: string;
  initialCity?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onStateChange,
  onCityChange,
  initialState,
  initialCity,
}) => {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await getStates();
        setStates(statesData);
        
        // If initial state is provided, find its ID
        if (initialState) {
          console.log("Initial state provided:", initialState);
          const stateObj = statesData.find(s => s.sigla === initialState);
          if (stateObj) {
            console.log("Found state:", stateObj.nome, stateObj.id);
            setSelectedStateId(stateObj.id.toString());
            // Load cities for this state
            loadCitiesForState(stateObj.id);
          }
        }
      } catch (error) {
        console.error("Error loading states:", error);
        toast.error("Erro ao carregar estados");
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, [initialState]);

  // Helper function to load cities for a state
  const loadCitiesForState = async (stateId: number) => {
    setLoadingCities(true);
    try {
      const citiesData = await getCities(stateId);
      setCities(citiesData);
      
      // If initial city is provided, select it
      if (initialCity) {
        console.log("Initial city provided:", initialCity);
        const cityObj = citiesData.find(c => c.nome === initialCity);
        if (cityObj) {
          console.log("Found city:", cityObj.nome);
          setSelectedCity(cityObj.nome);
        }
      }
    } catch (error) {
      console.error("Error loading cities:", error);
      toast.error("Erro ao carregar cidades");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleStateChange = async (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedCity("");
    setCities([]);

    const selectedState = states.find(s => s.id.toString() === stateId);
    if (selectedState) {
      onStateChange(selectedState.sigla);
    }
    
    // Load cities for the selected state
    await loadCitiesForState(parseInt(stateId));
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onCityChange(city);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="state">
          Estado <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedStateId}
          onValueChange={handleStateChange}
          disabled={loadingStates}
        >
          <SelectTrigger id="state" className="relative">
            <SelectValue placeholder="Selecione o estado" />
            {loadingStates && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.sigla} - {state.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">
          Cidade <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedCity}
          onValueChange={handleCityChange}
          disabled={loadingCities || cities.length === 0}
        >
          <SelectTrigger id="city" className="relative">
            <SelectValue placeholder={selectedStateId ? "Selecione a cidade" : "Selecione o estado primeiro"} />
            {loadingCities && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.nome}>
                {city.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
