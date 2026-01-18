import { execSync } from "child_process";

// Build command using pnpm exec or npx
function getBuildCommand(): string {
  // Try pnpm first
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm exec next build";
  } catch {
    // Fallback to npx
    return "npx next build";
  }
}

try {
  // Get commit hash
  const commitHash = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  
  // Set environment variable
  process.env.NEXT_PUBLIC_COMMIT_HASH = commitHash;
  
  console.log(`Building with commit hash: ${commitHash.substring(0, 7)}`);
  
  // Run next build with commit hash
  const buildCommand = getBuildCommand();
  execSync(buildCommand, {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_COMMIT_HASH: commitHash,
    },
  });
} catch (error: any) {
  // If getting commit hash failed, try building without it
  if (error.message && error.message.includes("git rev-parse")) {
    console.warn("Could not get commit hash, building without it");
    
    const buildCommand = getBuildCommand();
    execSync(buildCommand, {
      stdio: "inherit",
    });
  } else {
    // Build failed, exit with error code
    console.error("Build failed:", error.message || error);
    process.exit(1);
  }
}

