
import { Vehicle } from "@/types";

export const useVehicleImageHandlers = (
  formData: Partial<Vehicle>,
  setFormData: (data: Partial<Vehicle>) => void
) => {
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

  return {
    handleImageUpload,
    handleRemoveImage
  };
};
