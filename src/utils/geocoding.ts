import axios from 'axios';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function searchLocation(query: string): Promise<{ lat: number; lon: number; display_name: string }[]> {
  try {
    const response = await axios.get<NominatimResponse[]>(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );

    return response.data.map(item => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
}