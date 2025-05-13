
import { useState } from "react";
import { Vehicle } from "@/types";

export const useVehicleFormState = (initialData?: Partial<Vehicle>) => {
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

  return {
    formData,
    setFormData
  };
};
