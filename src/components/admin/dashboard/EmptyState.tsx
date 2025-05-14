
import React from "react";

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Não foi possível carregar os dados",
  submessage = "Tente novamente mais tarde"
}) => {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-gray-500">{submessage}</p>
    </div>
  );
};

export default EmptyState;
