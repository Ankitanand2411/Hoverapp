
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SafetyMetricsCharts } from "@/components/SafetyMetricsCharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Truck, Activity, Car, Bot } from "lucide-react";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import TelemetrySimulator from "@/utils/telemetrySimulator";

const SafetySuite = () => {
  const [safetyScore, setSafetyScore] = useState(85);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simulatorInstance, setSimulatorInstance] = useState(() => {
    // Create a simulator instance for the safety suite
    return new TelemetrySimulator({
      batteryCapacity: 1.5,
      maxSpeed: 45,
      payload: 120,
      range: 60,
    });
  });
  
  const handleStartSimulation = (scenarioType: string) => {
    setActiveSimulation(scenarioType);
    
    // Simulate an obstacle after 3 seconds for emergency braking
    if (scenarioType === 'emergency-braking') {
      setTimeout(() => {
        simulatorInstance.injectObstacle();
        
        // Update safety score after handling obstacle
        setTimeout(() => {
          const newScore = Math.min(100, safetyScore + 2);
          setSafetyScore(newScore);
        }, 2000);
      }, 3000);
    }
    
    // End simulation automatically after some time
    setTimeout(() => {
      setActiveSimulation(null);
    }, 10000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold cyber-text">Safety Suite</h1>
          <p className="text-muted-foreground">Test and improve safety performance</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-md">
          <Shield className="h-5 w-5 text-cyber-bright-purple" />
          <div>
            <div className="text-xs text-muted-foreground">Safety Score</div>
            <div className="text-lg font-bold">{safetyScore}/100</div>
          </div>
        </div>
      </div>
      
      {/* Safety Score Card */}
      <Card className="border-cyber-bright-purple/30">
        <CardHeader>
          <CardTitle>Safety Performance</CardTitle>
          <CardDescription>Your overall safety metrics and improvement areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">Overall Score</span>
                </div>
                <span className="text-sm">{safetyScore}/100</span>
              </div>
              <Progress value={safetyScore} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-muted/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Obstacle Avoidance</span>
                  <Badge className="bg-green-600">92/100</Badge>
                </div>
                <Progress value={92} className="h-1" />
                <p className="text-xs text-muted-foreground mt-2">Excellent obstacle detection and avoidance</p>
              </div>
              
              <div className="p-4 rounded-md bg-muted/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Emergency Braking</span>
                  <Badge className="bg-yellow-600">78/100</Badge>
                </div>
                <Progress value={78} className="h-1" />
                <p className="text-xs text-muted-foreground mt-2">Needs improvement on sudden stops</p>
              </div>
              
              <div className="p-4 rounded-md bg-muted/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Path Following</span>
                  <Badge className="bg-green-600">88/100</Badge>
                </div>
                <Progress value={88} className="h-1" />
                <p className="text-xs text-muted-foreground mt-2">Good lane-keeping with rare deviations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Simulation Scenarios */}
      <Tabs defaultValue="obstacle-avoidance" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="obstacle-avoidance">Obstacle Avoidance</TabsTrigger>
          <TabsTrigger value="emergency-braking">Emergency Braking</TabsTrigger>
          <TabsTrigger value="near-miss">Near Miss Scenarios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="obstacle-avoidance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Obstacle Avoidance Training
              </CardTitle>
              <CardDescription>
                Test how well your vehicle detects and avoids sudden obstacles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This simulation will randomly introduce obstacles in your vehicle's path.
                  Performance is scored based on detection speed and avoidance smoothness.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Random Pedestrians</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Static Objects</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Other Vehicles</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Difficulty Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Obstacle Density</span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Warning Time</span>
                        <Badge variant="outline">1.5 seconds</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Environment</span>
                        <Badge variant="outline">Urban</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-cyber-purple hover:bg-cyber-purple/80 neon-button"
                  onClick={() => handleStartSimulation('obstacle-avoidance')}
                  disabled={activeSimulation !== null}
                >
                  {activeSimulation === 'obstacle-avoidance' 
                    ? 'Simulation Running...' 
                    : 'Start Obstacle Avoidance Scenario'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {activeSimulation === 'obstacle-avoidance' && (
            <Card className="border-yellow-600">
              <CardHeader className="bg-yellow-900/20">
                <CardTitle className="text-yellow-400">
                  Simulation Active: Obstacle Avoidance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 p-3 bg-muted rounded-md text-center text-sm">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
                  <p>Watch for sudden obstacles appearing in your path!</p>
                  <p className="text-xs mt-2 text-muted-foreground">Use controls below to navigate</p>
                </div>
                
                <TelemetryPanel simulator={simulatorInstance} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="emergency-braking" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5 text-red-500" />
                Emergency Braking Drill
              </CardTitle>
              <CardDescription>
                Practice rapid response to critical situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This drill tests your vehicle's ability to come to a complete stop 
                  when a sudden obstacle appears at various speeds.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sudden Stops</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Panic Brake Testing</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Audio Warnings</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Parameters</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Starting Speed</span>
                        <Badge variant="outline">40 km/h</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Reaction Window</span>
                        <Badge variant="outline">0.8 seconds</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Surface Type</span>
                        <Badge variant="outline">Dry Asphalt</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-cyber-purple hover:bg-cyber-purple/80 neon-button"
                  onClick={() => handleStartSimulation('emergency-braking')}
                  disabled={activeSimulation !== null}
                >
                  {activeSimulation === 'emergency-braking' 
                    ? 'Simulation Running...' 
                    : 'Start Emergency Braking Drill'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {activeSimulation === 'emergency-braking' && (
            <Card className="border-red-600">
              <CardHeader className="bg-red-900/20">
                <CardTitle className="text-red-400">
                  Simulation Active: Emergency Braking
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-md text-center text-sm">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-500 animate-pulse" />
                  <p className="text-red-400">Accelerate to test speed. Emergency stop will be triggered soon!</p>
                  <p className="text-xs mt-2 text-muted-foreground">Press the brake when alerted</p>
                </div>
                
                <TelemetryPanel simulator={simulatorInstance} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="near-miss" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-cyber-bright-purple" />
                Near Miss Analysis
              </CardTitle>
              <CardDescription>
                Analyze close-call scenarios to improve safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This simulation recreates near-miss situations from real-world data,
                  allowing you to practice and improve responses to dangerous scenarios.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Intersection Scenarios</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cyclist Encounters</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Pedestrian Jaywalking</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Scenario Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Traffic Density</span>
                        <Badge variant="outline">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Environment</span>
                        <Badge variant="outline">Urban</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Time of Day</span>
                        <Badge variant="outline">Evening</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-cyber-purple hover:bg-cyber-purple/80 neon-button"
                  onClick={() => handleStartSimulation('near-miss')}
                  disabled={activeSimulation !== null}
                >
                  {activeSimulation === 'near-miss' 
                    ? 'Simulation Running...' 
                    : 'Start Near Miss Scenario'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {activeSimulation === 'near-miss' && (
            <Card className="border-cyber-bright-purple">
              <CardHeader className="bg-cyber-purple/20">
                <CardTitle className="text-cyber-bright-purple">
                  Simulation Active: Near Miss Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 p-3 bg-muted rounded-md text-center text-sm">
                  <Activity className="h-5 w-5 mx-auto mb-2" />
                  <p>Navigate through traffic and react to unexpected obstacles!</p>
                  <p className="text-xs mt-2 text-muted-foreground">Your reactions are being recorded and analyzed</p>
                </div>
                
                <TelemetryPanel simulator={simulatorInstance} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Safety Analytics and Reports */}
      <SafetyMetricsCharts />

      {/* Safety Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Report Summary</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-card">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Last Session</h4>
                <Badge variant="outline">Yesterday</Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score</span>
                  <span>82/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scenarios</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issues</span>
                  <span className="text-yellow-500">2</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-card">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Weekly Average</h4>
                <Badge variant="outline">+3pts</Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score</span>
                  <span>79/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Improvement</span>
                  <span className="text-green-500">4%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-card">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Recommendations</h4>
                <Shield className="h-4 w-4 text-cyber-bright-purple" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Focus areas:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Improve braking response time</li>
                  <li>Practice low-speed maneuvering</li>
                  <li>Work on obstacle detection</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetySuite;
