import http from 'k6/http';
import { check } from 'k6';

export const options = { vus: 10, duration: '10s' };

export default function () {
  const url = 'http://localhost:3000/api/bugs';
  const payload = JSON.stringify({
    title: 'Test Bug',
    severity: 'high',
    status: 'open'
  });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(url, payload, { headers });
  check(res, {
    'created bug': (r) => r.status === 201,
  });
}