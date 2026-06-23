const { exec } = require('child_process');

console.log("⚡ Starting Local Tunnel to expose local backend on port 5000...");

const lt = exec('npx localtunnel --port 5000');

lt.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('url is:')) {
    const url = output.split('url is:')[1].trim();
    console.log("\n=======================================================");
    console.log("🎉 SUCCESS: Your local backend is now public!");
    console.log("🔗 Public Tunnel URL: " + url);
    console.log("=======================================================");
    console.log("\n👉 Step-by-step fix for Vercel Login Page Error:");
    console.log("1. Open your Vercel Dashboard (https://vercel.com).");
    console.log("2. Go to: tn-schools ➔ Settings ➔ Environment Variables.");
    console.log("3. Add or Edit these three variables:");
    console.log("   • NEXT_PUBLIC_API_URL = " + url);
    console.log("   • NEXTAUTH_URL        = https://tn-schools.vercel.app");
    console.log("   • NEXTAUTH_SECRET     = tn-schools-ai-ecosystem-secret-2025");
    console.log("4. Click 'Save' and redeploy the frontend on Vercel.");
    console.log("=======================================================\n");
  } else {
    console.log(output.trim());
  }
});

lt.stderr.on('data', (data) => {
  console.error("Tunnel error:", data.toString().trim());
});

process.on('SIGINT', () => {
  console.log("\nStopping tunnel...");
  lt.kill();
  process.exit();
});
