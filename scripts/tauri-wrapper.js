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
    
    // On Windows, set comprehensive shell environment for Claude CLI POSIX shell support
    if (platform() === 'win32') {
        const gitBashPath = 'C:\\Program Files\\Git\\bin\\bash.exe';
        const gitBinDir = 'C:\\Program Files\\Git\\bin';
        
        // Set multiple shell-related environment variables
        env.SHELL = gitBashPath;
        env.BASH = gitBashPath;
        env.BASH_ENV = '';  // Prevent bash from sourcing additional files
        
        // Prepend Git Bash to PATH so it's found first
        env.PATH = `${gitBinDir};${env.PATH}`;
        
        // Set MSYS environment to indicate Git Bash/MSYS2 environment
        env.MSYSTEM = 'MINGW64';
        env.MSYS = 'winsymlinks:nativestrict';
        
        // Unset WSL-related variables to avoid conflicts
        delete env.WSL_DISTRO_NAME;
        delete env.WSLENV;
        
        // Force use of Windows-style paths for temp directories
        env.TMPDIR = env.TEMP || env.TMP || 'C:\\Windows\\Temp';
        env.TMP = env.TMPDIR;
        env.TEMP = env.TMPDIR;
        
        console.log(`Setting comprehensive Windows shell environment:`);
        console.log(`  SHELL: ${env.SHELL}`);
        console.log(`  BASH: ${env.BASH}`);
        console.log(`  MSYSTEM: ${env.MSYSTEM}`);
        console.log(`  Updated PATH with Git Bash directory`);
    }
    
    // Run tauri with the provided arguments using bun to execute local package
    const tauriCommand = spawn('bun', ['x', 'tauri', ...args], {
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