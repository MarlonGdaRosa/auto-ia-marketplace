import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { getVehicleById, getSellers } from "@/services/supabaseService";
import { 
  fetchBrands, fetchModelsByBrand, fetchYearsByBrandAndModel, fetchPriceByBrandModelYear,
  fetchBrandsMock, fetchModelsByBrandMock, fetchYearsByBrandAndModelMock, fetchPriceByBrandModelYearMock 
} from "@/services/vehicleAPI";
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
import { supabase } from "@/integrations/supabase/client";

interface FipePrice {
  preco: string;
  combustivel: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  codigoFipe?: string;
  mesReferencia?: string;
}

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  const [sellers, setSellers] = useState<Seller[]>([]);
  
  // FIPE API data
  const [brands, setBrands] = useState<{ id: string; nome: string }[]>([]);
  const [models, setModels] = useState<{ id: string; nome: string }[]>([]);
  const [years, setYears] = useState<{ id: string; nome: string }[]>([]);
  const [fipePrice, setFipePrice] = useState<FipePrice | null>(null);
  const [loadingFipe, setLoadingFipe] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);

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

  // Load brands from FIPE API
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await fetchBrands().catch(() => fetchBrandsMock());
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading brands:", error);
        toast.error("Erro ao carregar marcas de veículos");
      }
    };

    loadBrands();
  }, []);

  // Fetch sellers
  useEffect(() => {
    const loadSellers = async () => {
      const sellersData = await getSellers();
      setSellers(sellersData);
    };

    loadSellers();
  }, []);

  // Get vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
        const vehicle = await getVehicleById(id || "");
        if (vehicle) {
          setFormData(vehicle);
          
          // If we have brand data, load its models
          if (vehicle.brand) {
            const brandObj = brands.find(b => b.nome === vehicle.brand);
            if (brandObj) {
              handleBrandChange(brandObj.id);
            }
          }
        } else {
          toast.error("Veículo não encontrado");
          navigate("/admin/vehicles");
        }
      };

      loadVehicle();
    }
  }, [id, isEditMode, navigate, brands]);

  const handleBrandChange = async (brandId: string) => {
    setLoadingModels(true);
    setFormData(prev => ({
      ...prev,
      brand: brands.find(b => b.id === brandId)?.nome || "",
      model: "", // Reset model when brand changes
    }));
    
    try {
      const modelsData = await fetchModelsByBrand(brandId).catch(() => fetchModelsByBrandMock(brandId));
      setModels(modelsData);
    } catch (error) {
      console.error("Error loading models:", error);
      toast.error("Erro ao carregar modelos");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    const selectedBrand = brands.find(b => b.nome === formData.brand);
    if (!selectedBrand) return;
    
    setLoadingYears(true);
    setFormData(prev => ({
      ...prev,
      model: models.find(m => m.id === modelId)?.nome || "",
    }));
    
    try {
      const yearsData = await fetchYearsByBrandAndModel(selectedBrand.id, modelId)
        .catch(() => fetchYearsByBrandAndModelMock(selectedBrand.id, modelId));
      setYears(yearsData);
    } catch (error) {
      console.error("Error loading years:", error);
      toast.error("Erro ao carregar anos");
    } finally {
      setLoadingYears(false);
    }
  };

  const handleYearChange = async (yearId: string) => {
    const selectedBrand = brands.find(b => b.nome === formData.brand);
    const selectedModel = models.find(m => m.nome === formData.model);
    if (!selectedBrand || !selectedModel) return;
    
    setLoadingFipe(true);
    const year = parseInt(yearId.split('-')[0]);
    setFormData(prev => ({
      ...prev,
      year: year,
    }));
    
    try {
      const priceData = await fetchPriceByBrandModelYear(selectedBrand.id, selectedModel.id, yearId)
        .catch(() => fetchPriceByBrandModelYearMock(selectedBrand.id, selectedModel.id, yearId));
      
      if (priceData) {
        setFipePrice(priceData);
        
        // Set the fuel type based on the FIPE response
        let fuelType: "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex" = "flex";
        const fuelLower = priceData.combustivel.toLowerCase();
        
        if (fuelLower.includes("gasolina")) {
          fuelType = "gasoline";
        } else if (fuelLower.includes("álcool") || fuelLower.includes("etanol")) {
          fuelType = "ethanol";
        } else if (fuelLower.includes("diesel")) {
          fuelType = "diesel";
        } else if (fuelLower.includes("elétrico")) {
          fuelType = "electric";
        } else if (fuelLower.includes("híbrido")) {
          fuelType = "hybrid";
        }
        
        setFormData(prev => ({
          ...prev,
          fuel: fuelType,
        }));
      }
    } catch (error) {
      console.error("Error loading price:", error);
      toast.error("Erro ao carregar preço FIPE");
    } finally {
      setLoadingFipe(false);
    }
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

      // In a real app, this would be an API call to save the vehicle
      if (isEditMode) {
        const { error } = await supabase
          .from("vehicles")
          .update({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            transmission: formData.transmission,
            fuel: formData.fuel,
            location: formData.location,
            features: formData.features,
            description: formData.description,
            images: formData.images,
            status: formData.status,
            seller_id: formData.sellerId,
            updated_at: new Date().toISOString()
          })
          .eq("id", id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("vehicles")
          .insert({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            transmission: formData.transmission,
            fuel: formData.fuel,
            location: formData.location,
            features: formData.features || [],
            description: formData.description,
            images: formData.images || [],
            status: formData.status,
            seller_id: formData.sellerId
          });

        if (error) {
          throw error;
        }
      }

      toast.success(
        isEditMode
          ? "Veículo atualizado com sucesso!"
          : "Veículo cadastrado com sucesso!"
      );
      
      navigate("/admin/vehicles");
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

  // Format currency from string (R$ 10.387,00) to number
  const formatCurrencyToNumber = (currency: string): number => {
    if (!currency) return 0;
    return Number(
      currency
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );
  };

  return (
    <AdminLayout title={isEditMode ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">
                  Marca <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={brands.find(b => b.nome === formData.brand)?.id || ""}
                  onValueChange={handleBrandChange}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">
                  Modelo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={models.find(m => m.nome === formData.model)?.id || ""}
                  onValueChange={handleModelChange}
                  disabled={loadingModels || models.length === 0}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder={loadingModels ? "Carregando..." : "Selecione o modelo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">
                  Ano <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={years.find(y => parseInt(y.id.split('-')[0]) === formData.year)?.id || ""}
                  onValueChange={handleYearChange}
                  disabled={loadingYears || years.length === 0}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder={loadingYears ? "Carregando..." : "Selecione o ano"} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {fipePrice && (
                <div className="space-y-2 bg-muted p-3 rounded-md">
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
              )}

              <div className="space-y-2">
                <Label htmlFor="price">
                  Preço (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Quilometragem</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage || ""}
                  onChange={handleChange}
                />
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
                  value={formData.sellerId || ""}
                  onValueChange={(value) => handleSelectChange("sellerId", value)}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.state">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.location?.state || ""}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location!,
                        state: value,
                        city: "", // Reset city when state changes
                      },
                    });
                  }}
                >
                  <SelectTrigger id="location.state">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.city">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location.city"
                  name="location.city"
                  value={formData.location?.city || ""}
                  onChange={handleChange}
                  required
                />
              </div>
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
