import { spawn } from 'child_process';
import http from 'http';

const server = spawn('npm', ['start'], { stdio: 'inherit' });

function waitForServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkServer = () => {
      http.get('http://localhost:3000/', (res) => {
        if (res.statusCode === 200) {
          console.log('Server is ready!');
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

waitForServer().catch((err) => {
  console.error(err);
  process.exit(1);
}); 