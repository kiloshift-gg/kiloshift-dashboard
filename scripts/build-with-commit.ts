import { execSync } from "child_process";
import { spawn } from "child_process";

try {
  // Get commit hash
  const commitHash = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  
  // Set environment variable and run next build
  process.env.NEXT_PUBLIC_COMMIT_HASH = commitHash;
  
  console.log(`Building with commit hash: ${commitHash.substring(0, 7)}`);
  
  // Spawn next build process
  const buildProcess = spawn("next", ["build"], {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      NEXT_PUBLIC_COMMIT_HASH: commitHash,
    },
  });
  
  buildProcess.on("close", (code) => {
    process.exit(code || 0);
  });
  
  buildProcess.on("error", (error) => {
    console.error("Error running build:", error);
    process.exit(1);
  });
} catch (error) {
  console.warn("Could not get commit hash, building without it:", error);
  // Fallback: run build without commit hash
  const buildProcess = spawn("next", ["build"], {
    stdio: "inherit",
    shell: true,
  });
  
  buildProcess.on("close", (code) => {
    process.exit(code || 0);
  });
}

