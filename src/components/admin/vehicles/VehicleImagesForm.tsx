
import React from "react";
import { Vehicle } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleImagesFormProps {
  formData: Partial<Vehicle>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

const VehicleImagesForm: React.FC<VehicleImagesFormProps> = ({
  formData,
  handleImageUpload,
  handleRemoveImage,
}) => {
  return (
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
  );
};

export default VehicleImagesForm;
