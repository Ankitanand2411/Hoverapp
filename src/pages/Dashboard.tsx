
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Shield, Zap, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold cyber-text">Vehicle Dashboard</h1>
          <p className="text-muted-foreground">Real-time telemetry and system status</p>
        </div>
        
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-cyber-purple/10 text-cyber-bright-purple">
            Simulation Active
          </Badge>
          <Badge variant="outline" className="bg-green-900/20 text-green-400">
            System Normal
          </Badge>
        </div>
      </div>
      
      <TelemetryPanel />
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center">
                  <Shield className="h-4 w-4 mr-2" /> Safety Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Obstacle Detection</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emergency Braking</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lane Keeping</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center">
                  <Zap className="h-4 w-4 mr-2" /> Power Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Battery Health</span>
                    <Badge className="bg-green-600">98%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Power Management</span>
                    <Badge className="bg-green-600">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Regeneration</span>
                    <Badge className="bg-yellow-600">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center">
                  <Bell className="h-4 w-4 mr-2" /> Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Next Service</span>
                    <Badge variant="outline">450 km</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tire Pressure</span>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Software</span>
                    <Badge className="bg-green-600">Up to date</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Low Battery Warning</AlertTitle>
              <AlertDescription>
                Battery level below 30%. Please plan your route to include charging points.
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-muted">
              <Zap className="h-4 w-4" />
              <AlertTitle>Eco Tip</AlertTitle>
              <AlertDescription>
                Increase regenerative braking to 0.8 to extend range by 15% on your current route.
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-cyber-purple/10 border-cyber-bright-purple">
              <Bell className="h-4 w-4 text-cyber-bright-purple" />
              <AlertTitle className="text-cyber-bright-purple">Safety Score Updated</AlertTitle>
              <AlertDescription>
                Your safety score has been updated to 95/100 based on your recent trips.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vehicle settings can be adjusted on the home screen. Return to the vehicle configuration page to modify your vehicle parameters.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
