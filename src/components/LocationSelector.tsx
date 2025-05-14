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

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await getStates();
        setStates(statesData);

        if (initialState) {
          const stateObj = statesData.find(s => s.sigla === initialState);
          if (stateObj) {
            const stateId = stateObj.id;
            setSelectedStateId(stateId.toString());

            const citiesData = await getCities(stateId);
            setCities(citiesData);

            if (initialCity) {
              const cityObj = citiesData.find(c => c.nome === initialCity);
              if (cityObj) {
                setSelectedCity(cityObj.nome);
              }
            }
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
  }, [initialState, initialCity]);

  const handleStateChange = async (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedCity("");
    setCities([]);

    const selectedState = states.find(s => s.id.toString() === stateId);
    if (selectedState) {
      onStateChange(selectedState.sigla);
      try {
        setLoadingCities(true);
        const citiesData = await getCities(selectedState.id);
        setCities(citiesData);
      } catch (error) {
        toast.error("Erro ao carregar cidades");
      } finally {
        setLoadingCities(false);
      }
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    onCityChange(cityName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Estado *</Label>
        <Select value={selectedStateId} onValueChange={handleStateChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent>
            {loadingStates ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              states.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.sigla} - {state.nome}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cidade *</Label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a cidade" />
          </SelectTrigger>
          <SelectContent>
            {loadingCities ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              cities.map((city) => (
                <SelectItem key={city.id} value={city.nome}>
                  {city.nome}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
