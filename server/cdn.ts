import express from 'express';
import { cdnConfig } from './config';
import path from 'path';
import fs from 'fs';

export const setupCDN = (app: express.Application) => {
  if (!cdnConfig.enabled) return;

  const staticDir = path.join(process.cwd(), 'dist', 'static');
  
  // Ensure static directory exists
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  // Serve static files with cache control
  app.use(cdnConfig.staticPath, express.static(staticDir, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Add security headers for static files
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // Add cache control headers
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      
      // Add CORS headers for CDN
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
    }
  }));

  // Add CDN URL to response headers for client-side reference
  app.use((req, res, next) => {
    if (cdnConfig.baseUrl) {
      res.setHeader('X-CDN-URL', cdnConfig.baseUrl);
    }
    next();
  });
};

// Function to get CDN URL for a static asset
export const getCDNUrl = (assetPath: string): string => {
  if (!cdnConfig.enabled || !cdnConfig.baseUrl) {
    return assetPath;
  }
  return `${cdnConfig.baseUrl}${cdnConfig.staticPath}${assetPath}`;
}; 