
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  sonnerToast(title, {
    description,
  });
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: ToastProps) => {
      sonnerToast(title, {
        description,
      });
    },
  };
};
