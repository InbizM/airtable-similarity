
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fa14e69a8ce444839f79cb43c9ce6f49',
  appName: 'airtable-similarity',
  webDir: 'dist',
  server: {
    url: "https://fa14e69a-8ce4-4483-9f79-cb43c9ce6f49.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
