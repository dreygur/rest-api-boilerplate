const fs = require('node:fs');

const buildTarget = 'dist';
if (fs.existsSync(buildTarget)) fs.rmSync(buildTarget, { recursive: true, force: true });

// ESBUILD Options
const options = {
  entryPoints: ['./src/index.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  outdir: buildTarget,
  target: 'es2020',
  external: [
    '@mapbox/node-pre-gyp',
  ],
};

// Builder
function build() {
  require('esbuild')
    .build(options)
    .catch(() => process.exit(1));
}
build();