#!/usr/bin/env node
import { spawn } from 'child_process';
import { platform } from 'os';
import path from 'path';

/**
 * Wrapper script for Tauri commands that automatically sets required environment variables on Windows
 */

function runTauriCommand() {
    const args = process.argv.slice(2);
    
    // Set environment variables
    const env = { ...process.env };
    
    // On Windows, set SHELL to Git Bash for Claude CLI POSIX shell support
    if (platform() === 'win32') {
        env.SHELL = 'C:\\Program Files\\Git\\bin\\bash.exe';
        console.log(`Setting SHELL environment variable: ${env.SHELL}`);
    }
    
    // Run tauri with the provided arguments
    const tauriCommand = spawn('tauri', args, {
        stdio: 'inherit',
        env: env,
        shell: true
    });
    
    tauriCommand.on('error', (error) => {
        console.error('Error running tauri command:', error);
        process.exit(1);
    });
    
    tauriCommand.on('close', (code) => {
        process.exit(code);
    });
}

runTauriCommand(); 