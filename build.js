#!/usr/bin/env node

import { build } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function buildProject() {
  try {
    console.log('🏗️  Building TaskFlow for production...');
    
    // Build frontend with Vite
    console.log('📦 Building frontend...');
    await build({
      root: '.',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
    });
    
    // Build server with esbuild
    console.log('⚙️  Building server...');
    await execAsync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');
    
    // Copy package.json for production dependencies
    console.log('📋 Copying package.json...');
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      scripts: {
        start: 'node index.js'
      },
      dependencies: packageJson.dependencies
    };
    
    await fs.writeFile(
      path.join('dist', 'package.json'), 
      JSON.stringify(prodPackageJson, null, 2)
    );
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Output directory: dist/');
    console.log('🚀 Ready for deployment to Vercel');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();