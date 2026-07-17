// Quick verification script — checks that the app loads without import errors
try {
  const app = require('../server');
  console.log('SUCCESS: App loaded without errors');
  console.log('Routes registered:');
  if (app._router && app._router.stack) {
    app._router.stack
      .filter(r => r.route || (r.name === 'router'))
      .forEach(r => {
        if (r.route) {
          console.log(`  ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
        }
      });
  }
  process.exit(0);
} catch (e) {
  console.error('ERROR:', e.message);
  console.error(e.stack);
  process.exit(1);
}
