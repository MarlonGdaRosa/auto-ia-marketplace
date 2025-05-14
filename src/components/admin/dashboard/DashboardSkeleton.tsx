
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSkeleton;
