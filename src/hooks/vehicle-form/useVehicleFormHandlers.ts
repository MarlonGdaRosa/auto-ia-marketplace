
import { Vehicle } from "@/types";

export const useVehicleFormHandlers = (
  formData: Partial<Vehicle>,
  setFormData: (data: Partial<Vehicle>) => void
) => {
  const handlePriceChange = (value: string | undefined) => {
    // Convert to number for storage
    const numValue = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
    setFormData({
      ...formData,
      price: numValue
    });
  };

  const handleMileageChange = (value: string | undefined) => {
    // Handle the mileage input properly
    let numValue = 0;
    
    if (value) {
      // Remove all non-numeric characters including dots (thousand separators)
      const cleanValue = value.replace(/[^\d]/g, '');
      
      // Parse as integer
      numValue = parseInt(cleanValue);
      
      // If parsing failed, default to 0
      if (isNaN(numValue)) {
        numValue = 0;
      }
    }
    
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
    if (field === "location") {
      try {
        const locationObj = JSON.parse(value);
        setFormData({
          ...formData,
          location: locationObj
        });
      } catch (error) {
        console.error("Error parsing location JSON:", error);
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleStateChange = (state: string) => {
    setFormData({
      ...formData,
      location: {
        ...(formData.location || { city: "", region: "" }),
        state
      }
    });
  };

  const handleCityChange = (city: string) => {
    setFormData({
      ...formData,
      location: {
        ...(formData.location || { state: "", region: "" }),
        city
      }
    });
  };

  return {
    handleChange,
    handlePriceChange,
    handleMileageChange,
    handleFeatureChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
  };
};
