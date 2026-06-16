import { execSync } from "child_process";
import fs from "fs";

if (fs.existsSync("dist/index.js") && fs.existsSync("dist/index.mjs")) {
  console.log("[prepare] dist/ already present — skipping build.");
  process.exit(0);
}

try {
  execSync("npm run build", { stdio: "inherit" });
} catch (err) {
  console.warn(
    "[prepare] Could not build widget (devDependencies may be unavailable in production).",
  );
  if (!fs.existsSync("dist/index.js")) {
    throw err;
  }
}
