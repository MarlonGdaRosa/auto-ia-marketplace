
import { useState } from "react";
import { Vehicle } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { createVehicle, updateVehicle } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";

export const useVehicleForm = (id?: string, initialData?: Partial<Vehicle>) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<Partial<Vehicle>>(
    initialData || {
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
    }
  );

  const handlePriceChange = (value: string | undefined) => {
    // Convert to number for storage
    const numValue = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
    setFormData({
      ...formData,
      price: numValue
    });
  };

  const handleMileageChange = (value: string | undefined) => {
    // Convert to number for storage
    const numValue = value ? parseInt(value.replace(/\./g, '').replace(',', '')) : 0;
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
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log("Submitting vehicle data:", formData);

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
        toast({
          title: isEditMode ? "Veículo atualizado" : "Veículo cadastrado",
          description: isEditMode
            ? "Veículo atualizado com sucesso!"
            : "Veículo cadastrado com sucesso!",
        });
        navigate("/admin/vehicles");
      } else {
        throw new Error("Falha ao salvar o veículo");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Erro",
        description: isEditMode
          ? "Erro ao atualizar veículo"
          : "Erro ao cadastrar veículo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    isEditMode,
    handleChange,
    handlePriceChange,
    handleMileageChange,
    handleFeatureChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    setFormData
  };
};
