// const MicroRouter = require("@saahen.sriyan.mishra/micro-router");

const MicroRouter = require("./index");
const router = new MicroRouter();

router.register("GET", "/public", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Public Access!" }));
});

router.register("GET", "/secure-data", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Protected Data!" }));
});

router.register("POST", "/post-data", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Payload Received", data: req.body }));
});

router.register("GET", "/admin", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Admin Access!" }));
});

// Do NOT block localhost for testing
router.blockIP("127.0.0.1");

router.listen(4000);
