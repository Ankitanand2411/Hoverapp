
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import TelemetrySimulator from "@/utils/telemetrySimulator";
import { Battery, Thermometer, Navigation, Weight, Zap, Gauge } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface TelemetryData {
  speed: number;
  batteryLevel: number;
  estimatedRange: number;
  motorTemperature: number;
  payloadWeight: number;
  totalDistance: number;
  powerUsage: number;
  regeneration: number;
  brakesApplied: number;
}

const TelemetryGauge = ({ 
  value, 
  max, 
  label, 
  unit,
  icon: Icon,
  colorClass = "bg-cyber-purple"
}: { 
  value: number; 
  max: number; 
  label: string; 
  unit: string;
  icon: React.ElementType;
  colorClass?: string;
}) => {
  // Ensure the value is between 0 and max, then normalize to 0-1 range
  const normalizedValue = Math.max(0, Math.min(value, max)) / max;
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${colorClass}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="ml-2 text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-bold">{value.toFixed(1)} {unit}</span>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass}`} 
          style={{ width: `${normalizedValue * 100}%` }}
        ></div>
      </div>
    </Card>
  );
};

const BatteryGauge = ({ level }: { level: number }) => {
  let colorClass = "bg-red-500";
  if (level > 20) colorClass = "bg-yellow-500";
  if (level > 50) colorClass = "bg-green-500";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${level > 20 ? (level > 50 ? "bg-green-500" : "bg-yellow-500") : "bg-red-500"}`}>
            <Battery className="h-4 w-4 text-white" />
          </div>
          <span className="ml-2 text-sm font-medium">Battery</span>
        </div>
        <span className="text-lg font-bold">{level.toFixed(1)}%</span>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={colorClass}
          style={{ width: `${level}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        Estimated range: {(level * 0.5).toFixed(1)} km
      </div>
    </Card>
  );
};

interface TelemetryPanelProps {
  simulator?: TelemetrySimulator;
}

export const TelemetryPanel = ({ simulator }: TelemetryPanelProps) => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    speed: 0,
    batteryLevel: 100,
    estimatedRange: 20,
    motorTemperature: 25,
    payloadWeight: 50,
    totalDistance: 0,
    powerUsage: 0,
    regeneration: 0,
    brakesApplied: 0
  });
  
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [regenerationLevel, setRegenerationLevel] = useState(0.5); // Default regeneration level
  
  // Create simulator if not provided
  const telemetrySimulator = useMemo(() => {
    if (simulator) return simulator;
    
    // Try to get vehicle config from localStorage
    let vehicleConfig = {
      batteryCapacity: 1.2,
      maxSpeed: 40,
      payload: 120,
      range: 50,
    };
    
    try {
      const savedVehicle = localStorage.getItem('selectedVehicle');
      if (savedVehicle) {
        const parsed = JSON.parse(savedVehicle);
        vehicleConfig = parsed.stats;
      }
    } catch (e) {
      console.error('Error loading vehicle configuration', e);
    }
    
    return new TelemetrySimulator(vehicleConfig);
  }, [simulator]);
  
  useEffect(() => {
    // Start simulator and subscribe to updates
    telemetrySimulator.start(500);
    
    const unsubscribe = telemetrySimulator.subscribe((data) => {
      setTelemetry(data);
    });
    
    return () => {
      unsubscribe();
      telemetrySimulator.stop();
    };
  }, [telemetrySimulator]);

  useEffect(() => {
    // Update regeneration level in the simulator
    telemetrySimulator.setRegenerationLevel(regenerationLevel);
  }, [regenerationLevel, telemetrySimulator]);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setIsAccelerating(true);
        telemetrySimulator.setAccelerating(true);
      }
      if (e.key === 'ArrowDown') {
        setIsBraking(true);
        telemetrySimulator.setBraking(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setIsAccelerating(false);
        telemetrySimulator.setAccelerating(false);
      }
      if (e.key === 'ArrowDown') {
        setIsBraking(false);
        telemetrySimulator.setBraking(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [telemetrySimulator]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/10 backdrop-blur-sm border-cyber-bright-purple/30">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Speed</h3>
            <div className="text-4xl font-bold text-white cyber-text">
              {telemetry.speed.toFixed(1)} <span className="text-lg">km/h</span>
            </div>
          </div>
          
          <div className="h-3 bg-black/30 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyber-purple to-cyber-blue"
              style={{ width: `${(telemetry.speed / 60) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <Button 
              variant="outline" 
              className={`flex-1 ${isAccelerating ? 'bg-cyber-bright-purple/50' : ''}`}
              onMouseDown={() => {
                setIsAccelerating(true);
                telemetrySimulator.setAccelerating(true);
              }}
              onMouseUp={() => {
                setIsAccelerating(false);
                telemetrySimulator.setAccelerating(false);
              }}
              onMouseLeave={() => {
                if (isAccelerating) {
                  setIsAccelerating(false);
                  telemetrySimulator.setAccelerating(false);
                }
              }}
              onTouchStart={() => {
                setIsAccelerating(true);
                telemetrySimulator.setAccelerating(true);
              }}
              onTouchEnd={() => {
                setIsAccelerating(false);
                telemetrySimulator.setAccelerating(false);
              }}
            >
              Accelerate (↑)
            </Button>
            
            <Button 
              variant="outline" 
              className={`flex-1 ${isBraking ? 'bg-green-900/50' : ''}`}
              onMouseDown={() => {
                setIsBraking(true);
                telemetrySimulator.setBraking(true);
              }}
              onMouseUp={() => {
                setIsBraking(false);
                telemetrySimulator.setBraking(false);
              }}
              onMouseLeave={() => {
                if (isBraking) {
                  setIsBraking(false);
                  telemetrySimulator.setBraking(false);
                }
              }}
              onTouchStart={() => {
                setIsBraking(true);
                telemetrySimulator.setBraking(true);
              }}
              onTouchEnd={() => {
                setIsBraking(false);
                telemetrySimulator.setBraking(false);
              }}
            >
              Brake (↓)
            </Button>
          </div>
        </Card>
        
        <BatteryGauge level={telemetry.batteryLevel} />
        
        <TelemetryGauge 
          value={telemetry.motorTemperature}
          max={120}
          label="Motor Temp"
          unit="°C"
          icon={Thermometer}
          colorClass={telemetry.motorTemperature > 90 ? "bg-red-500" : telemetry.motorTemperature > 70 ? "bg-yellow-500" : "bg-cyber-blue"}
        />
        
        <TelemetryGauge 
          value={telemetry.totalDistance}
          max={100}
          label="Distance"
          unit="km"
          icon={Navigation}
          colorClass="bg-cyber-bright-purple"
        />
        
        <TelemetryGauge 
          value={telemetry.payloadWeight}
          max={200}
          label="Payload"
          unit="kg"
          icon={Weight}
          colorClass="bg-amber-500"
        />

        <Card className="p-4 col-span-1 md:col-span-2">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-1" /> Power Usage
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-md bg-gradient-to-b from-cyber-purple/20 to-transparent">
              <div className="text-lg font-bold">{telemetry.powerUsage.toFixed(2)} kW</div>
              <div className="text-xs text-muted-foreground">Consumption</div>
            </div>
            
            <div className="p-3 rounded-md bg-gradient-to-b from-green-800/20 to-transparent">
              <div className="text-lg font-bold">{telemetry.regeneration.toFixed(2)} kW</div>
              <div className="text-xs text-muted-foreground">Regeneration</div>
            </div>
          </div>
        </Card>

        {/* New Regenerative Braking Card */}
        <Card className="p-4 col-span-1 md:col-span-2 bg-gradient-to-b from-green-900/20 to-transparent">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium flex items-center">
              <Gauge className="h-4 w-4 mr-1" /> Regenerative Braking
            </h3>
            <Badge variant="outline" className="bg-green-900/30 text-green-400">
              {telemetry.brakesApplied} brakes
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={regenerationLevel}
                onChange={(e) => setRegenerationLevel(parseFloat(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-green-400">{(telemetry.regeneration * 0.25).toFixed(2)}%</div>
                <div className="text-muted-foreground">Battery Recovery</div>
              </div>
              <div>
                <div className="font-bold text-green-400">{(regenerationLevel * 100).toFixed(0)}%</div>
                <div className="text-muted-foreground">Regen Strength</div>
              </div>
            </div>

            <Progress 
              value={telemetry.regeneration * 20} 
              className="h-2 bg-secondary" 
            />
            
            <div className="text-xs text-muted-foreground text-center">
              Each braking recovers energy and extends battery life
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelemetryPanel;
