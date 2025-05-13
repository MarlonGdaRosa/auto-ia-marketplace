
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { getVehicleById, getSellers, createVehicle, updateVehicle } from "@/services/supabaseService";
import FipeVehicleSelector from "@/components/FipeVehicleSelector";
import LocationSelector from "@/components/LocationSelector";
import { Vehicle, Seller } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatMileage } from "@/lib/format";

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const isEditMode = !!id;
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [fipePrice, setFipePrice] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    transmission: "manual",
    fuel: "flex",
    location: {
      state: "",
      city: "",
      region: "",
    },
    features: [],
    description: "",
    images: [],
    status: "available",
  });

  // Format price display
  const [formattedPrice, setFormattedPrice] = useState('');
  const [formattedMileage, setFormattedMileage] = useState('');

  useEffect(() => {
    if (formData.price !== undefined) {
      setFormattedPrice(formatCurrency(formData.price).replace('R$', '').trim());
    }
  }, [formData.price]);

  useEffect(() => {
    if (formData.mileage !== undefined) {
      setFormattedMileage(formatMileage(formData.mileage).replace('km', '').trim());
    }
  }, [formData.mileage]);

  // Fetch sellers
  useEffect(() => {
    const loadSellers = async () => {
      try {
        const sellersData = await getSellers();
        setSellers(sellersData);
      } catch (error) {
        console.error("Error loading sellers:", error);
        toast.error("Erro ao carregar vendedores");
      }
    };

    loadSellers();
  }, []);

  // Get vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
        setInitialLoading(true);
        try {
          const vehicle = await getVehicleById(id || "");
          if (vehicle) {
            setFormData(vehicle);
            setFormattedPrice(formatCurrency(vehicle.price).replace('R$', '').trim());
            setFormattedMileage(formatMileage(vehicle.mileage).replace('km', '').trim());
          } else {
            toast.error("Veículo não encontrado");
            navigate("/admin/vehicles");
          }
        } catch (error) {
          console.error("Error loading vehicle:", error);
          toast.error("Erro ao carregar dados do veículo");
          navigate("/admin/vehicles");
        } finally {
          setInitialLoading(false);
        }
      };

      loadVehicle();
    }
  }, [id, isEditMode, navigate]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal separator
    const value = e.target.value.replace(/[^\d,.]/g, '');
    setFormattedPrice(value);
    
    // Convert to number for storage
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    setFormData({
      ...formData,
      price: numValue
    });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^\d,.]/g, '');
    setFormattedMileage(value);
    
    // Convert to number for storage
    const numValue = parseInt(value.replace(/\./g, '').replace(',', '')) || 0;
    setFormData({
      ...formData,
      mileage: numValue
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location!,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>, feature: string) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), feature],
      });
    } else {
      setFormData({
        ...formData,
        features: (formData.features || []).filter((f) => f !== feature),
      });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleStateChange = (state: string) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location!,
        state
      }
    });
  };

  const handleCityChange = (city: string) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location!,
        city
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you'd upload these to a storage service
      // For demo purposes, we'll create local URLs
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newImages],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.brand ||
        !formData.model ||
        !formData.year ||
        !formData.price ||
        !formData.location?.state ||
        !formData.location?.city
      ) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }

      let result;
      if (isEditMode) {
        result = await updateVehicle(id!, {
          ...formData,
          updated_at: new Date().toISOString()
        });
      } else {
        result = await createVehicle(formData);
      }

      if (result) {
        toast.success(
          isEditMode
            ? "Veículo atualizado com sucesso!"
            : "Veículo cadastrado com sucesso!"
        );
        navigate("/admin/vehicles");
      } else {
        throw new Error("Falha ao salvar o veículo");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        isEditMode
          ? "Erro ao atualizar veículo"
          : "Erro ao cadastrar veículo"
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout title={isEditMode ? "Carregando Veículo..." : "Novo Veículo"}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6">
            {/* FIPE Vehicle Selector */}
            <FipeVehicleSelector 
              onBrandChange={(brand) => setFormData({...formData, brand})}
              onModelChange={(model) => setFormData({...formData, model})}
              onYearChange={(year) => setFormData({...formData, year})}
              onFuelChange={(fuel) => setFormData({...formData, fuel})}
              onFipePriceChange={setFipePrice}
              initialBrand={formData.brand}
              initialModel={formData.model}
              initialYear={formData.year}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Preço (R$) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    className="pl-8"
                    value={formattedPrice}
                    onChange={handlePriceChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Quilometragem</Label>
                <div className="relative">
                  <Input
                    id="mileage"
                    name="mileage"
                    type="text"
                    className="pr-8"
                    value={formattedMileage}
                    onChange={handleMileageChange}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">km</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "available"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Câmbio</Label>
                <Select
                  value={formData.transmission || "manual"}
                  onValueChange={(value) => handleSelectChange("transmission", value)}
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
                <Label htmlFor="fuel">Combustível</Label>
                <Select
                  value={formData.fuel || "flex"}
                  onValueChange={(value) => handleSelectChange("fuel", value)}
                >
                  <SelectTrigger id="fuel">
                    <SelectValue placeholder="Selecione o combustível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasolina</SelectItem>
                    <SelectItem value="ethanol">Etanol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Elétrico</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>
                    <SelectItem value="flex">Flex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller">Vendedor</Label>
                <Select
                  value={formData.seller_id || ""}
                  onValueChange={(value) => handleSelectChange("seller_id", value)}
                >
                  <SelectTrigger id="seller">
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Location Selector - IBGE API integration */}
            <div className="grid grid-cols-1 gap-4">
              <LocationSelector 
                onStateChange={handleStateChange}
                onCityChange={handleCityChange}
                initialState={formData.location?.state}
                initialCity={formData.location?.city}
              />
              
              <div className="space-y-2">
                <Label htmlFor="location.region">Região</Label>
                <Input
                  id="location.region"
                  name="location.region"
                  value={formData.location?.region || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Características/Acessórios</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  "Ar condicionado",
                  "Direção hidráulica",
                  "Direção elétrica",
                  "Vidros elétricos",
                  "Travas elétricas",
                  "Airbag",
                  "ABS",
                  "Câmera de ré",
                  "Sensor de estacionamento",
                  "Central multimídia",
                  "Bancos em couro",
                  "Alarme",
                  "Rodas de liga leve",
                  "Computador de bordo",
                  "Piloto automático",
                  "Teto solar",
                ].map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.features || []).includes(feature)}
                      onChange={(e) => handleFeatureChange(e, feature)}
                      className="h-4 w-4"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Imagens</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border bg-gray-50"
                    >
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      "flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed",
                      "bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    )}
                  >
                    <Upload className="h-6 w-6 mb-1 text-gray-400" />
                    <span className="text-sm text-gray-500">Adicionar</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/vehicles")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Salvando..." : "Cadastrando..."}
                </>
              ) : (
                <>{isEditMode ? "Salvar" : "Cadastrar"}</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default VehicleForm;
