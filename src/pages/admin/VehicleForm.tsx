
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { getVehicleById, sellers } from "@/services/mockData";
import { Vehicle } from "@/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const isEditMode = !!id;

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

  // Get vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const vehicle = getVehicleById(id || "");
      if (vehicle) {
        setFormData(vehicle);
      } else {
        toast.error("Veículo não encontrado");
        navigate("/admin/vehicles");
      }
    }
  }, [id, isEditMode, navigate]);

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

  const handleAiProcessing = async () => {
    if (!aiDescription.trim()) {
      toast.error("Por favor, insira uma descrição para processar");
      return;
    }

    setAiProcessing(true);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Parse the description based on keywords
      const description = aiDescription.toLowerCase();

      // Extract brand
      const brands = ["toyota", "honda", "volkswagen", "fiat", "chevrolet", "hyundai", "bmw", "mercedes-benz"];
      const foundBrand = brands.find(brand => description.includes(brand.toLowerCase()));

      // Extract model (basic simulation)
      let model = "";
      if (description.includes("corolla")) model = "Corolla";
      else if (description.includes("civic")) model = "Civic";
      else if (description.includes("gol")) model = "Gol";
      else if (description.includes("strada")) model = "Strada";
      else if (description.includes("onix")) model = "Onix";
      else if (description.includes("hb20")) model = "HB20";
      else model = "Modelo";

      // Extract year
      const yearRegex = /\b(20[0-9][0-9]|19[8-9][0-9])\b/;
      const yearMatch = description.match(yearRegex);
      const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

      // Extract price
      const priceRegex = /\b(\d+)[ .]?mil\b|\bR\$[ .]?(\d+\.?\d*)/i;
      const priceMatch = description.match(priceRegex);
      let price = 0;
      if (priceMatch) {
        if (priceMatch[1]) {
          price = parseInt(priceMatch[1]) * 1000;
        } else if (priceMatch[2]) {
          price = parseFloat(priceMatch[2].replace(".", ""));
        }
      }

      // Extract mileage
      const mileageRegex = /\b(\d+)[ .]?km\b|\b(\d+)[ .]?mil[ .]?km\b/i;
      const mileageMatch = description.match(mileageRegex);
      let mileage = 0;
      if (mileageMatch) {
        if (mileageMatch[1]) {
          mileage = parseInt(mileageMatch[1]);
        } else if (mileageMatch[2]) {
          mileage = parseInt(mileageMatch[2]) * 1000;
        }
      }

      // Transmission
      const transmission = description.includes("automático") || description.includes("automatico") 
        ? "automatic" 
        : "manual";

      // Fuel
      let fuel = "flex";
      if (description.includes("gasolina")) fuel = "gasoline";
      else if (description.includes("etanol")) fuel = "ethanol";
      else if (description.includes("diesel")) fuel = "diesel";
      else if (description.includes("elétrico") || description.includes("eletrico")) fuel = "electric";
      else if (description.includes("híbrido") || description.includes("hibrido")) fuel = "hybrid";

      // Location
      const states = {
        sp: "SP",
        rj: "RJ",
        mg: "MG",
      };
      
      const cities = {
        "são paulo": "São Paulo",
        "sao paulo": "São Paulo",
        "rio de janeiro": "Rio de Janeiro",
        "belo horizonte": "Belo Horizonte",
        "campinas": "Campinas",
      };
      
      let state = "";
      let city = "";
      
      for (const [key, value] of Object.entries(states)) {
        if (description.includes(key.toLowerCase())) {
          state = value;
          break;
        }
      }
      
      for (const [key, value] of Object.entries(cities)) {
        if (description.includes(key.toLowerCase())) {
          city = value;
          break;
        }
      }

      // Features
      const featureKeywords = [
        { keyword: "ar condicionado", feature: "Ar condicionado" },
        { keyword: "direção hidráulica", feature: "Direção hidráulica" },
        { keyword: "direção elétrica", feature: "Direção elétrica" },
        { keyword: "vidros elétricos", feature: "Vidros elétricos" },
        { keyword: "travas elétricas", feature: "Travas elétricas" },
        { keyword: "airbag", feature: "Airbag" },
        { keyword: "abs", feature: "ABS" },
        { keyword: "câmera de ré", feature: "Câmera de ré" },
        { keyword: "sensor de estacionamento", feature: "Sensor de estacionamento" },
        { keyword: "multimídia", feature: "Central multimídia" },
      ];
      
      const features: string[] = [];
      featureKeywords.forEach(({ keyword, feature }) => {
        if (description.includes(keyword.toLowerCase())) {
          features.push(feature);
        }
      });

      // Set the extracted data
      setFormData({
        ...formData,
        brand: foundBrand ? foundBrand.charAt(0).toUpperCase() + foundBrand.slice(1) : "",
        model,
        year,
        price,
        mileage,
        transmission: transmission as "manual" | "automatic",
        fuel: fuel as "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex",
        location: {
          state,
          city,
          region: "",
        },
        features,
        description: aiDescription,
      });

      toast.success("Informações extraídas com sucesso!");
    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("Erro ao processar a descrição");
    } finally {
      setAiProcessing(false);
    }
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
      await new Promise(resolve => setTimeout(resolve, 1000));

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

  return (
    <AdminLayout title={isEditMode ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="manual">Preenchimento Manual</TabsTrigger>
              <TabsTrigger value="ai">Processamento por IA</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">
                      Marca <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">
                      Modelo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">
                      Ano <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
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
                        {/* Add other states as needed */}
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
            </TabsContent>

            <TabsContent value="ai">
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">
                    Processamento por IA
                  </h3>
                  <p className="text-yellow-700 mb-2">
                    Digite ou cole uma descrição detalhada do veículo e nossa IA
                    extrairá automaticamente as informações relevantes.
                  </p>
                  <p className="text-yellow-600 text-sm">
                    Quanto mais detalhada a descrição, melhor será o resultado.
                    Inclua informações sobre marca, modelo, ano, preço, quilometragem,
                    características, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-description">Descrição do Veículo</Label>
                  <Textarea
                    id="ai-description"
                    rows={8}
                    placeholder="Ex: Toyota Corolla 2022, preto, 15.000 km rodados, completíssimo com ar condicionado, direção elétrica, câmbio automático, motor flex, 4 portas, bancos em couro, R$120.000,00. Único dono, todas as revisões na concessionária. Localizado em São Paulo/SP."
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="resize-y"
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAiProcessing}
                    disabled={aiProcessing || !aiDescription.trim()}
                    className="min-w-[200px]"
                  >
                    {aiProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Processar com IA"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Após o processamento, você poderá revisar e editar as informações na aba "Preenchimento Manual".
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
