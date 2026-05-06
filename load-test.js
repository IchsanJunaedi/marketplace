import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10, // Virtual Users
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/products'); // Assuming this exists
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
