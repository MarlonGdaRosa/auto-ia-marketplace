
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export const useToast = () => {
  return {
    toast: (props: ToastProps) => toast(props),
    toasts: [], // Required for compatibility with some components
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
};

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  if (variant === 'destructive') {
    return sonnerToast.error(title, { description });
  }
  
  if (variant === 'success') {
    return sonnerToast.success(title, { description });
  }
  
  // Default case
  return sonnerToast(title, { description });
};
