import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.belgogames.mathagon2",
  appName: "Mathagon 2",
  webDir: "out",

  server: {
    url: "https://mathagon.belgogames.com",
  },
};

export default config;
