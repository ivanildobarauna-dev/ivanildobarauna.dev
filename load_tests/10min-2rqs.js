import http from 'k6/http';
import { sleep, check } from 'k6';

const DURATION = __ENV.DURATION || '10m';
const RAMP_UP  = __ENV.RAMP_UP  || '30s';
const THINK    = Number((__ENV.THINK || '0s').replace('s',''));

export const options = {
  scenarios: {
    users_with_pacing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: RAMP_UP, target: 10 },
        { duration: DURATION, target: 10 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],                         // <1% errors
    http_req_duration: ['p(95)<2000'],                      // 95% < 2s
    'checks{check_name:status_is_200}': ['rate>0.99'],      // 99% must be 200
    'checks{check_name:body_contains_doctype}': ['rate>0.95'], // 95% must contain DOCTYPE
  },
};

function desyncFirstIter() {
  if (__ITER === 0) {
    const offset = Math.random() * THINK;
    sleep(offset);
  }
}

export default function () {
  desyncFirstIter();

  const res = http.get('https://ivanildobarauna.dev', {
    tags: { test: 'homepage' },
  });

  // Checks with explicit names for Datadog metrics
  check(res, {
    status_is_200: (r) => r.status === 200,
    body_contains_doctype: (r) => r.body.includes('<!DOCTYPE'),
  }, { check_name: 'status_is_200' });

  sleep(THINK);
}
