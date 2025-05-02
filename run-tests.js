const { execSync, exec } = require("child_process");

console.log("⏳ Waiting for server to boot...");
setTimeout(() => {
    try {
        console.log("Public Access Route:");
        console.log(execSync(`curl http://localhost:4000/public`).toString());

        console.log("Payload Validation:");
        console.log(execSync(`curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"test\"}" http://localhost:4000/post-data`).toString());

        console.log("Rate Limiting & DDoS Protection:");
        for (let i = 1; i <= 7; i++) {
            console.log(`Request ${i}:`);
            console.log(execSync(`curl http://localhost:4000/admin`).toString());
        }

        console.log("Secure Headers:");
        console.log(execSync(`curl -I http://localhost:4000/admin`).toString());

        console.log("IP Blacklisting Test:");
        console.log(execSync(`curl http://localhost:4000/public`).toString());
    } catch (err) {
        console.error("Error during test:", err.stdout?.toString() || err.message);
    }
    process.exit(0);
}, 1500);
