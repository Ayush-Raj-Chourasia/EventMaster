import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurity, dbConfig, cdnConfig } from "./config";
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();
let server: any = null;

// Health check endpoint - must be before other middleware
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup security middleware
setupSecurity(app);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;
});

// Start server function
async function startServer() {
  try {
    // Register routes
    await registerRoutes(app);

    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = Number(process.env.PORT) || 5000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

    // SSL configuration for production
    if (process.env.NODE_ENV === 'production' && process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        minVersion: 'TLSv1.2' as const,
        ciphers: [
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-ECDSA-AES256-GCM-SHA384',
          'ECDHE-RSA-AES256-GCM-SHA384'
        ].join(':')
      };

      https.createServer(sslOptions, app).listen(443, host, () => {
        log(`HTTPS server running on port 443`);
      });
    }

    // Start HTTP server
    server = app.listen(port, host, () => {
      log(`Server running on port ${port}`);
      log(`Health check available at http://${host}:${port}/api/health`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    });

  } catch (error: unknown) {
    log('Failed to start server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Start the server
startServer();
