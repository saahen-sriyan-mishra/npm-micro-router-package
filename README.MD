# @saahen.sriyan.mishra/micro-router

A lightweight, dependency-free, and secure HTTP router for Node.js that provides essential routing capabilities combined with built-in security, logging, and rate limiting — perfect for microservices, internal tools, or fast prototyping.

---
## Installation

```bash
npm install @saahen.sriyan.mishra/micro-router
```

## Usages

**Import**
``` JavaScript
const MicroRouter = require("@saahen.sriyan.mishra/micro-router");
const router = new MicroRouter();
```

| Method                     | Parameters                | Description                                                                                   | Automates / Simplifies                      |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `router.register()`        | `(method, path, handler)` | Registers a new route (GET, POST, PUT, DELETE)                                                | Avoids writing custom route handling logic  |
| `router.listen()`          | `(port = 3000)`           | Starts the HTTP server and listens on the given port                                          | Bootstraps server with built-in security    |
| `router.blockIP()`         | `(ip)`                    | Adds an IP address to the internal blacklist                                                  | Manual firewall-like control                |
| `router.allowIP()`         | `(ip)`                    | Removes an IP from the blacklist                                                              | Grants access back to blocked IPs           |
| `router.showLogs()`        | `()`                      | Displays the internal request logs with timestamp, method, and IP                             | Makes auditing/debugging easier             |
| *Built-in Middleware*      | (internal, auto-invoked)  | Applies security headers, rate-limiting, JSON validation, payload size limiting automatically | No need for separate middlewares            |
| `router.validatePayload()` | `(req, res, callback)`    | Parses and validates JSON for POST/PUT requests (called automatically)                        | Prevents invalid or oversized JSON manually |
| `router.middleware()`      | `(req, res)`              | Checks for blacklists, rate limits, secure headers (auto-used in `.handler()`)                | Handles security policies out-of-the-box    |
| `router.handler()`         | `(req, res)`              | Internal routing logic that invokes correct route handlers (auto-used in `.listen()`)         | Complete route + validation logic           |
| `router.normalizeIP()`     | `(ip)`                    | Standardizes local and remote IP formats                                                      | Handles localhost vs real IP equivalence    |



## Why Use MicroRouter?

Modern backend applications need to be fast, secure, and lightweight. `@saahen.sriyan.mishra/micro-router` is built with **zero dependencies**, yet it offers **production-minded features** such as:

- Minimalist Routing (GET, POST, PUT, DELETE)
- IP Blacklisting / Whitelisting
- Rate Limiting (to prevent abuse)
- Secure HTTP Headers (CSP, X-Frame-Options, etc.)
- Request Logging
- Payload Size Protection
- Suspicious IP Tracking and Blocking

This makes it ideal for:

- Microservices or serverless environments
- Educational and internal tools
- Prototypes with strong security defaults
- Replacements for Express/Koa when only minimal functionality is needed

---