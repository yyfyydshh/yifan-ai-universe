import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { resolve } from "node:path";

const verifier = resolve(homedir(), ".codex", "skills", "identity-skill", "scripts", "verify_identity_run.py");
const result = spawnSync("python", [verifier, resolve(".")], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
