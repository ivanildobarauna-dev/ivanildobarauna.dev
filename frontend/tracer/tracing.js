const tracer = require('./node_modules/dd-trace').init({
    service: process.env.DD_SERVICE || 'frontend-nextjs',
    hostname: process.env.DD_AGENT_HOST || 'localhost',
    env: process.env.DD_ENV || 'development',
    version: process.env.DD_VERSION || 'local',
    logInjection: true,
    runtimeMetrics: true,
    analytics: true
  });
  
  console.log('[dd-trace] Tracing initialized ✅');
  
  tracer.trace('nextjs.boot', { resource: 'startup' }, (span) => {
    span.setTag('startup', true);
    span.setTag('origin', 'dd-trace preload');
    span.finish();
  });
  
