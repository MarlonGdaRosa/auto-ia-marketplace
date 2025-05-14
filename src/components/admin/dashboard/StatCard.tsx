
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  footerItems?: Array<{
    label: string;
    value: number | string;
    color?: string;
  }>;
  progressValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  footerItems = [],
  progressValue 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {footerItems.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            {footerItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                {item.color && (
                  <div className={`h-2 w-2 rounded-full bg-${item.color}`}></div>
                )}
                <div className="text-xs text-gray-500">{item.value} {item.label}</div>
              </div>
            ))}
          </div>
        )}
        {progressValue !== undefined && (
          <Progress 
            value={progressValue} 
            className="h-1 mt-1"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
