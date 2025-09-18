import 'dotenv/config';
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { ExpressAppConfig } from './src/config/ExpressAppConfig';

const appConfig = new ExpressAppConfig();
const app = appConfig.getApp();

(async () => {
  const server = createServer(app);
  
  if (!appConfig.isRunningInLambda()) {
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  }

  if (!appConfig.isRunningInLambda()) {
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", async () => {
      log(`serving on port ${port}`);
      await appConfig.initializeDefaultUser();
    });
  } else {
    await appConfig.initializeDefaultUser();
  }
})();
