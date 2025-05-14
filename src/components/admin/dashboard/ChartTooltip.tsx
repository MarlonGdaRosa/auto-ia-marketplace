
import React from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<any>;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
