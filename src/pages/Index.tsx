
import { VehicleSelector } from "@/components/VehicleSelector";

const Index = () => {
  return (
    <div className="container mx-auto py-6 px-4 relative">
      {/* Cyber grid background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-cyber-radial opacity-50 pointer-events-none"></div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyber-bright-purple to-cyber-bright-blue bg-clip-text text-transparent">
          HoverRobotix Simulator
        </h1>
        <p className="text-lg mt-4 text-muted-foreground">
          Configure and experience next-generation personal electric vehicles and delivery robots
        </p>
      </div>
      
      <VehicleSelector />
    </div>
  );
};

export default Index;
