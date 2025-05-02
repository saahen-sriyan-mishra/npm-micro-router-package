// index.js
const http = require("http");
const url = require("url");

class MicroRouter {
    constructor() {
        this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
        this.rateLimitMap = new Map();
        this.ipBlacklist = new Set();
        this.ipWhitelist = new Set(); // Optional
        this.requestLog = [];
        this.suspiciousIPAttempts = new Map();

        this.secureHeaders = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Content-Security-Policy": "default-src 'self'"
        };
    }

    normalizeIP(ip) {
        if (ip === "::1" || ip === "::ffff:127.0.0.1") return "127.0.0.1";
        return ip;
    }

    register(method, path, handler) {
        if (!this.routes[method]) throw new Error(`Unsupported HTTP method: ${method}`);
        this.routes[method][path] = handler;
    }

    validatePayload(req, res, callback) {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
            if (body.length > 1e6) {
                res.writeHead(413, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Payload too large" }));
                req.connection.destroy();
            }
        });
        req.on("end", () => {
            try {
                if (body) req.body = JSON.parse(body);
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON payload" }));
                return;
            }
            callback();
        });
    }

    middleware(req, res) {
        let ip = this.normalizeIP(req.socket.remoteAddress);

        // Blacklist
        if (this.ipBlacklist.has(ip)) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Access Denied" }));
            return false;
        }

        // Rate Limit
        const now = Date.now();
        const windowMs = 5000;
        const maxRequests = 5;
        const requests = this.rateLimitMap.get(ip) || [];
        const filtered = requests.filter(t => now - t < windowMs);
        filtered.push(now);
        this.rateLimitMap.set(ip, filtered);

        if (filtered.length > maxRequests) {
            res.writeHead(429, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Too many requests, slow down!" }));
            return false;
        }

        // Suspicious Monitoring
        const fails = this.suspiciousIPAttempts.get(ip) || 0;
        if (fails >= 10) {
            this.blockIP(ip);
            return false;
        }

        // Secure Headers
        Object.entries(this.secureHeaders).forEach(([k, v]) => res.setHeader(k, v));

        // Request Log
        this.requestLog.push({
            ip, method: req.method, path: req.url, time: new Date().toISOString()
        });

        return true;
    }

    handler(req, res) {
        const method = req.method;
        const parsedUrl = url.parse(req.url, true);
        const ip = this.normalizeIP(req.socket.remoteAddress);

        if (!this.middleware(req, res)) {
            this.suspiciousIPAttempts.set(ip, (this.suspiciousIPAttempts.get(ip) || 0) + 1);
            return;
        }

        const routeHandler = this.routes[method]?.[parsedUrl.pathname];

        if (routeHandler) {
            if (["POST", "PUT"].includes(method)) {
                this.validatePayload(req, res, () => routeHandler(req, res));
            } else {
                routeHandler(req, res);
            }
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Route Not Found" }));
        }
    }

    listen(port = 3000) {
        const server = http.createServer((req, res) => this.handler(req, res));
        server.listen(port, () => console.log(`✅ SecureRouter running on port ${port}`));
    }

    blockIP(ip) {
        this.ipBlacklist.add(this.normalizeIP(ip));
        console.log(`🚫 Blocked IP: ${ip}`);
    }

    allowIP(ip) {
        this.ipBlacklist.delete(this.normalizeIP(ip));
        console.log(`✅ Allowed IP: ${ip}`);
    }

    showLogs() {
        console.log("📜 Request Logs:", this.requestLog);
    }
}

module.exports = MicroRouter;
