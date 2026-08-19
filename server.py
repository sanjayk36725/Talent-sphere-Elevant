import os
import sys
import subprocess
import signal
from pathlib import Path

def main():
    print("=" * 60)
    print("  Talent Sphere Academy - Python Server Launcher")
    print("=" * 60)

    project_dir = Path(__file__).parent.resolve()
    os.chdir(project_dir)

    # Ensure .env exists
    env_file = project_dir / ".env"
    env_example = project_dir / ".env.example"
    if not env_file.exists() and env_example.exists():
        print("[+] Initializing .env configuration...")
        env_file.write_text(env_example.read_text())

    # Check node_modules
    if not (project_dir / "node_modules").exists():
        print("[+] Installing dependencies (npm install)...")
        subprocess.run("npm install", shell=True, check=True)

    print("\n[+] Starting server on http://localhost:3000")
    print("[+] Press Ctrl+C to stop.\n")

    process = subprocess.Popen(
        "npx tsx server.ts",
        shell=True,
        cwd=project_dir
    )

    def shutdown(sig=None, frame=None):
        print("\n[-] Stopping server...")
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
        sys.exit(0)

    try:
        process.wait()
    except KeyboardInterrupt:
        shutdown()

if __name__ == "__main__":
    main()
