
import { useState, useCallback } from "react";
import { Vehicle } from "@/types";
import { createVehicle, updateVehicle } from "@/services/supabaseService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface UseVehicleFormImplementationOptions {
  initialData?: Vehicle | null;
}

export const useVehicleFormImplementation = (
  options?: UseVehicleFormImplementationOptions
) => {
  const { initialData } = options || {};
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>(
    initialData || {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      transmission: "manual",
      fuel: "flex",
      features: [],
      description: "",
      images: [],
      location: {
        state: "",
        city: "",
        region: ""
      },
      status: "available",
    }
  );

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle select changes
  const handleSelectChange = useCallback((name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle location changes
  const handleLocationChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  }, []);

  // Handle FIPE data selection
  const handleFipeData = useCallback((fipeData: any) => {
    setFormData((prev) => ({
      ...prev,
      brand: fipeData.brand || prev.brand,
      model: fipeData.model || prev.model,
      year: fipeData.year || prev.year,
    }));
  }, []);

  // Handle features changes
  const handleFeaturesChange = useCallback((features: string[]) => {
    setFormData((prev) => ({ ...prev, features }));
  }, []);

  // Handle image upload
  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;
    
    // Mock image upload - in a real app this would upload to storage
    // and return URLs
    const newImages = Array.from(files).map((file) => {
      return URL.createObjectURL(file);
    });
    
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  }, []);

  // Remove image
  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  // Reorder images
  const reorderImages = useCallback((sourceIndex: number, destinationIndex: number) => {
    setFormData((prev) => {
      const images = [...(prev.images || [])];
      const [removed] = images.splice(sourceIndex, 1);
      images.splice(destinationIndex, 0, removed);
      return { ...prev, images };
    });
  }, []);

  // Submit form
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      
      if (!formData.brand || !formData.model || !formData.price) {
        toast.error("Preencha todos os campos obrigatórios");
        setIsSubmitting(false);
        return;
      }
      
      if (initialData?.id) {
        // Update existing vehicle
        await updateVehicle(initialData.id, formData);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        // Create new vehicle
        await createVehicle(formData);
        toast.success("Veículo cadastrado com sucesso!");
      }
      
      navigate("/admin/vehicles");
    } catch (error: any) {
      console.error("Error submitting vehicle form:", error);
      toast.error(`Erro ao salvar veículo: ${error.message || "Tente novamente"}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, navigate]);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleLocationChange,
    handleFipeData,
    handleFeaturesChange,
    handleFileChange,
    removeImage,
    reorderImages,
    handleSubmit,
    isSubmitting,
    isEditing: !!initialData?.id,
  };
};

export default useVehicleFormImplementation;
