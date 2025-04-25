
import { useState, useRef, useEffect } from "react";

export function useRouteSimulation({
  defaultSpeed = 28,
  batteryTotal = 100,
  origin,
  destination,
  routePath,
  simulationActive,
  onSimulationEnd,
}: {
  defaultSpeed?: number;
  batteryTotal?: number;
  origin?: [number, number];
  destination?: [number, number];
  routePath?: [number, number][];
  simulationActive: boolean;
  onSimulationEnd?: () => void;
}) {
  const [vehiclePosition, setVehiclePosition] = useState<[number, number]>();
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [battery, setBattery] = useState(batteryTotal);

  const timer = useRef<number | null>(null);

  // Haversine Distance Utility
  function haversineDistance(a: [number, number], b: [number, number]) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const [lat1, lon1] = a;
    const [lat2, lon2] = b;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const aH =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    return R * 2 * Math.atan2(Math.sqrt(aH), Math.sqrt(1 - aH));
  }

  // Manage simulation timer
  useEffect(() => {
    if (!simulationActive) {
      window.clearInterval(timer.current as any);
      setVehiclePosition(undefined);
      setDistanceCovered(0);
      setBattery(batteryTotal);
      return;
    }
    if (!routePath || routePath.length < 2) return;
    let progress = 0;
    const intervalMs = 80;
    const totalDist = haversineDistance(routePath[0], routePath[1]);
    timer.current = window.setInterval(() => {
      progress += speed * (intervalMs / 3600000);
      let percent = Math.min(progress / totalDist, 1);
      const lat = routePath[0][0] + (routePath[1][0] - routePath[0][0]) * percent;
      const lng = routePath[0][1] + (routePath[1][1] - routePath[0][1]) * percent;
      setVehiclePosition([lat, lng]);
      setDistanceCovered(totalDist * percent);
      setBattery(Math.max(batteryTotal - percent * (30 + Math.random() * 8), 0));

      if (percent >= 1) {
        setVehiclePosition(routePath[1]);
        setDistanceCovered(totalDist);
        setBattery((b) => Math.max(b - 2, 0));
        window.clearInterval(timer.current as any);
        if (onSimulationEnd) setTimeout(() => onSimulationEnd(), 200); // Let the UI update slightly before ending
      }
    }, intervalMs);
    return () => window.clearInterval(timer.current as any);
    // eslint-disable-next-line
  }, [simulationActive, routePath, speed, batteryTotal]);

  // if start, instantly set vehiclePosition
  useEffect(() => {
    if (simulationActive && origin) setVehiclePosition(origin);
    // eslint-disable-next-line
  }, [simulationActive, origin]);

  return {
    vehiclePosition,
    speed,
    setSpeed,
    distanceCovered,
    battery,
    setBattery,
  };
}
