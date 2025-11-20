const { execSync } = require('child_process');
const { spawn } = require('child_process');

// Get git commit hash with fallback priority:
// 1. VERCEL_GIT_COMMIT_SHA (provided by Vercel)
// 2. Git commit hash from local git
// 3. 'development' as fallback
let commitHash = 'development';

// Check Vercel environment variable first (for Vercel deployments)
if (process.env.VERCEL_GIT_COMMIT_SHA) {
  commitHash = process.env.VERCEL_GIT_COMMIT_SHA;
  console.log('Using Vercel git commit SHA');
} else {
  // Try to get from local git repository
  try {
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    console.warn('Could not get git commit hash, using "development"');
  }
}

// Set environment variable and run next build
process.env.NEXT_PUBLIC_COMMIT_HASH = commitHash;

console.log(`Building with commit hash: ${commitHash.substring(0, 7)}`);

// Increase Node.js memory limit to avoid out of memory errors
// Default is ~1.5GB, increase to 4GB for large builds
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS 
  ? `${process.env.NODE_OPTIONS} --max-old-space-size=4096`
  : '--max-old-space-size=4096';

// Spawn next build process
const nextBuild = spawn('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
    NODE_OPTIONS: process.env.NODE_OPTIONS,
  },
});

nextBuild.on('close', (code) => {
  process.exit(code);
});

