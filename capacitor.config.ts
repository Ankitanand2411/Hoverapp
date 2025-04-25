
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.407aa84e641b4525b52379b630495210',
  appName: 'rover-sim-pilot',
  webDir: 'dist',
  server: {
    url: 'https://407aa84e-641b-4525-b523-79b630495210.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
