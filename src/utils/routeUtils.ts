import axios from 'axios';

interface RoutingResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }>;
}

export async function getShortestRoute(
  origin: [number, number],
  destination: [number, number],
  vehicleType: "bike" | "delivery-bot" = "bike"
): Promise<[number, number][]> {
  try {
    // Select appropriate OSRM profile based on vehicle type
    const profile = vehicleType === "bike" ? "cycling" : "walking";
    
    // Using OSRM demo server - for production, use a dedicated routing service
    const response = await axios.get<RoutingResponse>(
      `https://router.project-osrm.org/route/v1/${profile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
    );

    if (response.data.routes.length === 0) {
      throw new Error('No route found');
    }

    // OSRM returns coordinates in [longitude, latitude] format, we need to swap to [latitude, longitude]
    return response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
  } catch (error) {
    console.error('Error fetching route:', error);
    // Fallback to straight line if routing fails
    return [origin, destination];
  }
}