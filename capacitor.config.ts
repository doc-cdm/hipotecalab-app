import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hipotecalab.app',
  appName: 'HipotecaLab',
  webDir: 'dist',
  plugins: {
    SystemBars: { style: 'DARK' }
  },
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'HipotecaLab'
  }
};

export default config;
