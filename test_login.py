import requests
import json

print("Testing login endpoints...")

# Test direct backend
print("\n1. Direct to Backend (port 8000):")
try:
    r = requests.post('http://localhost:8000/auth/login', json={'email':'demo@marketmind.ai','password':'demo1234'}, timeout=3)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        print("   ✅ Backend login works!")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Check GET to /auth
print("\n1b. GET /auth endpoint:")
try:
    r = requests.get('http://localhost:3000/auth/login', timeout=3)
    print(f"   Status: {r.status_code}")
    print(f"   Content-Type: {r.headers.get('content-type', 'unknown')}")
    print(f"   Body: {r.text[:200]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test via proxy
print("\n2. Via Frontend Proxy (port 3000):")
try:
    r = requests.post('http://localhost:3000/auth/login', json={'email':'demo@marketmind.ai','password':'demo1234'}, timeout=3)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   ✅ Proxy login works!")
        print(f"   User: {data['user']['email']}")
    else:
        print(f"   Response: {r.text[:100]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test if / returns static files
print("\n3. Frontend Static Files (port 3000):")
try:
    r = requests.get('http://localhost:3000/', timeout=3)
    print(f"   Status: {r.status_code}")
    if 'DOCTYPE' in r.text or 'react' in r.text.lower():
        print("   ✅ Frontend serving correctly")
except Exception as e:
    print(f"   ❌ Error: {e}")
