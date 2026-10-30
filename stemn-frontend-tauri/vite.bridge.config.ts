/**
 * The bridge (window.stemnDesktop, src/bridge) as one classic script for Rust to inject as an
 * initialization script (src-tauri/src/windows.rs includes dist-bridge/stemn-bridge.js).
 */
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { tauriRoot } from './vite.shared'

export default defineConfig(({ mode }) => ({
  clearScreen: false,
  define: { 'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production') },
  build: {
    outDir: join(tauriRoot, 'dist-bridge'),
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: join(tauriRoot, 'src/bridge/index.ts'),
      formats: ['iife'],
      name: 'StemnDesktopBridge',
      fileName: () => 'stemn-bridge.js',
    },
  },
}))
