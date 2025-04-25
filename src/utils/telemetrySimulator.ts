
// Utility to simulate real-time telemetry data for the vehicle

interface TelemetryData {
  speed: number;             // km/h
  batteryLevel: number;      // percentage
  estimatedRange: number;    // km
  motorTemperature: number;  // Celsius
  payloadWeight: number;     // kg
  totalDistance: number;     // km
  powerUsage: number;        // kW
  regeneration: number;      // kW
  brakesApplied: number;     // count
}

class TelemetrySimulator {
  private baseData: TelemetryData;
  private intervalId: number | null = null;
  private listeners: ((data: TelemetryData) => void)[] = [];
  private noiseLevel: number = 0.1;
  private accelerating: boolean = false;
  private braking: boolean = false;
  private batteryDrainRate: number = 0.05; // % per update when moving
  private maxSpeed: number;
  private baseRange: number;
  private baseBattery: number;
  private regenerationLevel: number = 0.5; // Default regeneration level (0.1 to 1)
  private lastBrakingState: boolean = false;

  constructor(vehicleConfig: {
    batteryCapacity: number;
    maxSpeed: number;
    payload: number;
    range: number;
  }) {
    this.maxSpeed = vehicleConfig.maxSpeed;
    this.baseRange = vehicleConfig.range;
    this.baseBattery = 100; // Always start with full battery
    
    this.baseData = {
      speed: 0,
      batteryLevel: this.baseBattery,
      estimatedRange: this.baseRange,
      motorTemperature: 25,
      payloadWeight: vehicleConfig.payload * 0.5, // Start with half the max payload
      totalDistance: 0,
      powerUsage: 0,
      regeneration: 0,
      brakesApplied: 0
    };
  }

  public start(updateIntervalMs: number = 1000): void {
    if (this.intervalId !== null) {
      this.stop();
    }
    
    // Using window.setInterval as we're in browser context
    this.intervalId = window.setInterval(() => {
      this.updateTelemetry();
      this.notifyListeners();
    }, updateIntervalMs);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(listener: (data: TelemetryData) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public setAccelerating(isAccelerating: boolean): void {
    this.accelerating = isAccelerating;
  }

  public setBraking(isBraking: boolean): void {
    // Track when braking is newly applied to count brake applications
    if (isBraking && !this.lastBrakingState) {
      this.baseData.brakesApplied++;
    }
    this.braking = isBraking;
    this.lastBrakingState = isBraking;
  }

  public setRegenerationLevel(level: number): void {
    // Ensure level is between 0.1 and 1
    this.regenerationLevel = Math.max(0.1, Math.min(level, 1));
  }

  public injectObstacle(): void {
    // Simulate emergency braking
    this.braking = true;
    this.baseData.speed = Math.max(0, this.baseData.speed * 0.5);
    this.baseData.brakesApplied++;
    
    // Automatically release brake after 2 seconds
    setTimeout(() => {
      this.braking = false;
    }, 2000);
  }

  private updateTelemetry(): void {
    // Update speed based on acceleration/braking
    if (this.accelerating && !this.braking) {
      this.baseData.speed = Math.min(
        this.maxSpeed, 
        this.baseData.speed + (this.maxSpeed / 10)
      );
    } else if (this.braking) {
      this.baseData.speed = Math.max(0, this.baseData.speed - (this.maxSpeed / 5));
    } else {
      // Slow natural deceleration
      this.baseData.speed = Math.max(0, this.baseData.speed - 1);
    }

    // Calculate power usage based on speed (quadratic relationship)
    const normalizedSpeed = this.baseData.speed / this.maxSpeed;
    this.baseData.powerUsage = normalizedSpeed ** 2 * 3; // Max ~3kW at top speed
    
    // Calculate regeneration when braking - now affected by regeneration level setting
    const regenerationEffect = this.braking 
      ? Math.min(3, this.baseData.speed / 10) * this.regenerationLevel 
      : 0;
    this.baseData.regeneration = regenerationEffect;
    
    // Update battery level - drain faster at higher speeds, charge with regeneration
    const netPowerUsage = Math.max(0, this.baseData.powerUsage - this.baseData.regeneration);
    let batteryChange = 0;
    
    if (this.baseData.speed > 0) {
      // Battery drain when moving (reduced by regeneration)
      batteryChange = -this.batteryDrainRate * (netPowerUsage / 2);
    } else {
      // Minimal drain when idle
      batteryChange = -0.01;
    }
    
    // Add regeneration charge when braking
    if (this.braking && this.baseData.speed > 5) {
      // More effective at higher speeds
      const regenCharge = 0.05 * this.regenerationLevel * (this.baseData.speed / this.maxSpeed);
      batteryChange += regenCharge;
    }
    
    // Apply battery change (can be positive or negative)
    this.baseData.batteryLevel = Math.min(100, Math.max(0, this.baseData.batteryLevel + batteryChange));
    
    // Update estimated range based on battery level and usage pattern
    const rangeMultiplier = this.baseData.batteryLevel / 100;
    this.baseData.estimatedRange = this.baseRange * rangeMultiplier;
    
    // Update motor temperature (increases with speed and time, decreases when idle)
    const targetTemp = 25 + (50 * normalizedSpeed);
    this.baseData.motorTemperature = this.baseData.motorTemperature * 0.95 + targetTemp * 0.05;
    
    // Update distance traveled
    this.baseData.totalDistance += this.baseData.speed / 3600; // Convert km/h to km/s * update interval
    
    // Apply random noise to simulate sensor fluctuations
    this.applyNoise();
  }

  private applyNoise(): void {
    this.baseData.speed += this.addNoise(this.baseData.speed);
    this.baseData.motorTemperature += this.addNoise(this.baseData.motorTemperature, 0.5);
    this.baseData.powerUsage += this.addNoise(this.baseData.powerUsage, 0.2);
  }
  
  private addNoise(value: number, scaleFactor: number = 1): number {
    const noiseAmount = value * this.noiseLevel * scaleFactor;
    return ((Math.random() - 0.5) * 2) * noiseAmount;
  }

  private notifyListeners(): void {
    const dataCopy = { ...this.baseData };
    this.listeners.forEach(listener => listener(dataCopy));
  }
}

export default TelemetrySimulator;
