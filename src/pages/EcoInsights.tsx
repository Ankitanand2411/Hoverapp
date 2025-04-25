
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Leaf, Car, BarChart2, Award, TrendingUp, TrendingDown } from "lucide-react";
import { EcoMetricsCharts } from "@/components/EcoMetricsCharts";

interface EcoStat {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

const EcoInsights = () => {
  const [greenScore, setGreenScore] = useState(73);
  const [timeframe, setTimeframe] = useState("week");
  
  const ecoStats: EcoStat[] = [
    {
      label: "CO₂ Saved",
      value: "32.5 kg",
      change: 12,
      icon: Leaf
    },
    {
      label: "Energy Efficiency",
      value: "4.2 km/kWh",
      change: 5,
      icon: Zap
    },
    {
      label: "Car Trips Avoided",
      value: "18",
      change: 22,
      icon: Car
    },
    {
      label: "Green Score",
      value: `${greenScore}/100`,
      change: 8,
      icon: Award
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold cyber-text">Eco Insights</h1>
          <p className="text-muted-foreground">Track your environmental impact and optimize efficiency</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-green-900/20 px-4 py-2 rounded-md">
          <Leaf className="h-5 w-5 text-green-400" />
          <div>
            <div className="text-xs text-muted-foreground">Green Score</div>
            <div className="text-lg font-bold text-green-400">{greenScore}/100</div>
          </div>
        </div>
      </div>
      
      {/* Green Score Card */}
      <Card className="border-green-600/30 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-500 via-green-500 to-green-600" 
             style={{ width: `${greenScore}%` }}></div>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-green-500" /> 
            Your Environmental Impact
          </CardTitle>
          <CardDescription>
            Track how your vehicle usage compares to traditional transportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ecoStats.map((stat) => (
                <Card key={stat.label} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-900/30">
                          <stat.icon className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="ml-2 text-sm font-medium">{stat.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <div className="flex items-center text-xs">
                        {stat.change > 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">+{stat.change}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-red-500">{stat.change}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-md bg-muted/30">
              <h3 className="text-lg font-medium mb-4">CO₂ Comparison: HoverRobotix vs Car</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      <span className="text-sm">Average Car</span>
                    </div>
                    <span className="text-sm">120 kg CO₂</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      <span className="text-sm">Your HoverRobotix</span>
                    </div>
                    <span className="text-sm">32.5 kg CO₂</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '27%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-900/20 border border-green-900/40 rounded-md">
                <div className="flex">
                  <Leaf className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-400">You've saved 87.5 kg of CO₂ emissions!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      That's equivalent to planting 4 trees or avoiding 350 miles of car travel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Environmental Analytics and Reports */}
      <EcoMetricsCharts />
      
      {/* Eco Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Eco Tips</CardTitle>
            <CardDescription>Personalized recommendations to improve efficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex">
                <div className="bg-green-900/30 p-2 rounded-full mr-3">
                  <Zap className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Increase Regenerative Braking</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set your regenerative braking level to 0.8 to recover up to 15% more energy during city commutes
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex">
                <div className="bg-green-900/30 p-2 rounded-full mr-3">
                  <TrendingDown className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Avoid Hills on Route #3</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Taking the alternative route on your regular commute can save 12% battery consumption
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex">
                <div className="bg-green-900/30 p-2 rounded-full mr-3">
                  <BarChart2 className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Optimize Speed Profile</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maintaining speeds between 15-25 km/h maximizes your vehicle's efficiency
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Tips</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Challenge</CardTitle>
            <CardDescription>Complete eco challenges to earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-cyber-purple/10 rounded-md border border-cyber-purple/30">
              <h3 className="font-medium text-cyber-bright-purple mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2" /> Zero-Emissions Week
              </h3>
              
              <p className="text-sm mb-3">
                Complete all your trips this week using only your HoverRobotix vehicle
              </p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress: 5/7 days</span>
                    <span>71%</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div 
                      key={day + index} 
                      className={`text-center p-1 rounded-md text-xs ${
                        index < 5 
                          ? "bg-cyber-purple/30 text-cyber-bright-purple" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm">
                <span className="flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-green-400" />
                  Reward: +10 Green Points
                </span>
                <Badge variant="outline" className="bg-cyber-purple/20 text-cyber-bright-purple">
                  2 days left
                </Badge>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Previous Achievements</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <Badge className="mr-2 bg-green-600">✓</Badge>
                    Eco Route Master
                  </span>
                  <span className="text-xs text-muted-foreground">Last week</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <Badge className="mr-2 bg-green-600">✓</Badge>
                    Energy Optimizer
                  </span>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Challenges</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* CO2 Savings Summary */}
      <Card className="bg-gradient-to-b from-green-900/20 to-transparent border-green-600/30">
        <CardHeader>
          <CardTitle className="text-center">Environmental Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-green-900/30 mb-4">
              <Leaf className="h-12 w-12 text-green-400" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-green-400">187.5 kg CO₂</h3>
              <p className="text-sm text-muted-foreground">Total emissions saved this year</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Trees Equivalent</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">750</div>
                <p className="text-xs text-muted-foreground">Car Miles Avoided</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">kWh Saved</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-green-700 hover:bg-green-600">Share Your Impact</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EcoInsights;
