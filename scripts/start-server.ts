import { spawn } from 'child_process';
import http from 'http';
import path from 'path';

// Start the server directly using ts-node
const server = spawn('ts-node', [path.join(__dirname, '..', 'src', 'server.ts')], { 
  stdio: 'inherit',
  shell: true,
  detached: true  // Allow the process to run independently
});

// Unref the server process so the parent can exit
server.unref();

function waitForServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkServer = () => {
      http.get('http://localhost:3000/', (res) => {
        if (res.statusCode === 200) {
          console.log('Server is ready!');
          // Don't wait for server to exit, just resolve
          resolve();
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Server failed to start'));
          } else {
            setTimeout(checkServer, 1000);
          }
        }
      }).on('error', () => {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error('Server failed to start'));
        } else {
          setTimeout(checkServer, 1000);
        }
      });
    };

    checkServer();
  });
}

// Handle server process exit
server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code}`);
    process.exit(code || 1);
  }
});

// Wait for server to be ready, then exit this script
waitForServer()
  .then(() => {
    console.log('Server started successfully, proceeding with tests...');
    process.exit(0);  // Exit this script, leaving the server running
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 