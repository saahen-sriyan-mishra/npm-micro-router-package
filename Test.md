### Public Access Route

```
C:\Users\Saahen>curl [http://localhost:4000/public](http://localhost:4000/public)
{"message":"Public Access!"}
```

### Payload Validation
```
C:\Users\Saahen>curl -X POST -H "Content-Type: application/json" -d "{"name":"test"}" [http://localhost:4000/post-data](http://localhost:4000/post-data)
{"message":"Payload Received","data":{"name":"test"}}
```

### Rate Limiting & DDoS Protection
```
C:\Users\Saahen>for /l %i in (1,1,7) do curl [http://localhost:4000/admin](http://localhost:4000/admin)

C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"message":"Admin Access!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"message":"Admin Access!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"message":"Admin Access!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"message":"Admin Access!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"message":"Admin Access!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"error":"Too many requests, slow down!"}
C:\Users\Saahen>curl [http://localhost:4000/admin](http://localhost:4000/admin)
{"error":"Too many requests, slow down!"}
```

### Secure Headers
```
C:\Users\Saahen>curl -I [http://localhost:4000/admin](http://localhost:4000/admin)
HTTP/1.1 404 Not Found
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Content-Type: application/json
Date: Fri, 02 May 2025 15:07:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### IP Blacklisting

On uncommenting **router.blockIP("127.0.0.1");** for doing the router block id
```
C:\Users\Saahen>curl [http://localhost:4000/public](http://localhost:4000/public)
{"error":"Access Denied"}
```
