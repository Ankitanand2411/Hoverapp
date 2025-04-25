
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RouteStatsProps {
  speed: number;
  distanceCovered: number;
  battery: number;
}

const RouteStats: React.FC<RouteStatsProps> = ({ speed, distanceCovered, battery }) => (
  <Card className="w-full mt-4">
    <CardContent className="flex flex-col sm:flex-row px-3 py-4 justify-around items-center gap-3">
      <div className="flex flex-col items-center">
        <span className="text-cyber-bright-purple text-lg font-bold">
          {speed} km/h
        </span>
        <span className="text-xs text-muted-foreground">Speed</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-cyber-bright-purple text-lg font-bold">
          {distanceCovered.toFixed(2)} km
        </span>
        <span className="text-xs text-muted-foreground">Distance Covered</span>
      </div>
      <div className="flex flex-col items-center">
        <span className={`font-bold text-lg ${battery > 30 ? "text-green-500" : "text-orange-500 animate-pulse"}`}>
          {battery.toFixed(0)}%
        </span>
        <span className="text-xs text-muted-foreground">Battery</span>
      </div>
    </CardContent>
  </Card>
);

export default RouteStats;
