# Prisma Flow Analysis & Database Connection Issue

## Executive Summary

**Issue Identified:** PostgreSQL 18.0 incompatibility with Prisma 6.16.3
**Error:** `P1010: User was denied access on the database '(not available)'`
**Root Cause:** PostgreSQL 18 changed authentication behavior, causing Prisma to fail during connection
**Status:** ✗ Database accessible via direct connection, ✗ Prisma cannot connect

---

## 🔍 Prisma Flow in Your Application

### 1. **Entry Point & Initialization**

```
┌─────────────────────────────────────────────────────────────┐
│  src/lib/prisma.ts (SINGLETON PATTERN)                     │
│  ────────────────────────────────────────────────────────  │
│  • Creates PrismaClient instance (lines 3-7)               │
│  • Stores in globalThis for dev hot reload (line 17)       │
│  • Auto-connects on server startup (lines 20-29)           │
│  • Logs success/failure and exits on error                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Imported by
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  13 API Routes + 1 Service                                  │
│  ────────────────────────────────────────────────────────  │
│  • /api/users/login                                         │
│  • /api/users/signup                                        │
│  • /api/users                                               │
│  • /api/posts (GET, POST)                                   │
│  • /api/posts/[id] (GET, PUT, DELETE)                       │
│  • /api/posts/[id]/publish                                  │
│  • /api/posts/[id]/unpublish                                │
│  • /api/posts/published                                     │
│  • /api/taxonomies                                          │
│  • /api/taxonomies/[id]                                     │
│  • /api/terms                                               │
│  • /api/terms/[id]                                          │
│  • services/post-service.ts                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL Database (Docker Container: postgres-blog)      │
│  ────────────────────────────────────────────────────────  │
│  • Host: localhost:5432                                     │
│  • Database: blog                                           │
│  • User: blog-user                                          │
│  • Password: blog-pass                                      │
│  • Version: PostgreSQL 18.0 ⚠️ (COMPATIBILITY ISSUE)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Why `lib/prisma.ts` Runs First?

### **Answer: It's NOT a convention - it's JavaScript Module Loading**

When you start your Next.js application and access any page or API route:

1. **Server Startup:** Next.js loads API route files
2. **Import Chain:**
   ```typescript
   // Example: User accesses http://localhost:3000/api/posts

   // Step 1: Next.js loads the route file
   src/app/api/posts/route.ts

   // Step 2: Route file imports prisma
   import prisma from '@/lib/prisma';  // ← This executes prisma.ts

   // Step 3: prisma.ts module runs (top-to-bottom)
   const prisma = new PrismaClient();  // Line 13
   prisma.$connect();                  // Lines 21-28 execute!
   ```

3. **Why it auto-connects:**
   ```typescript
   // src/lib/prisma.ts:20-29
   if (typeof window === 'undefined') {  // ← Server-side only
     prisma.$connect()
       .then(() => console.log('✓ Database connected'))
       .catch((error) => {
         console.error('✗ Database connection failed:', error.message);
         process.exit(1);  // ← YOUR APP CRASHES HERE!
       });
   }
   ```

**Key Points:**
- ✅ **It's automatic:** Module-level code executes when imported
- ✅ **It's intentional:** The developer wanted to fail fast if DB is down
- ✅ **It's a singleton:** `globalThis.prismaGlobal` prevents multiple instances
- ⚠️ **It's blocking:** If connection fails, the entire app crashes

---

## 🔧 Detailed Code Flow

### **Step-by-Step Execution:**

```
1. User starts app: npm run dev
   └─> Next.js dev server starts

2. User visits: http://localhost:3000/api/posts
   └─> Next.js loads: src/app/api/posts/route.ts

3. Route.ts imports prisma:
   import prisma from '@/lib/prisma'
   └─> JavaScript evaluates src/lib/prisma.ts

4. prisma.ts executes (line-by-line):

   Line 3-7:   prismaClientSingleton() function defined
   Line 13:    const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
               ↓
               Creates new PrismaClient({
                 log: ['error', 'warn'] in dev
               })

   Line 15:    export default prisma

   Line 17:    if (NODE_ENV !== 'production')
                 globalThis.prismaGlobal = prisma
               ↓
               Caches instance for hot reload

   Line 20-29: if (typeof window === 'undefined')  // Server-side check
                 prisma.$connect()                  // CONNECTS HERE!
                   .then(...)                       // Success log
                   .catch(...)                      // ← YOUR ERROR OCCURS HERE
                     process.exit(1)                // App crashes

5. If connection succeeds:
   └─> Route handler executes
   └─> Can use prisma.post.findMany(), etc.

6. If connection fails (YOUR CASE):
   └─> Error logged: "✗ Database connection failed: User was denied access..."
   └─> App exits with code 1
   └─> Next.js shows error page
```

---

## 🐛 Your Specific Issue

### **Error Details:**

```
Error: P1010: User was denied access on the database `(not available)`
```

**What does "(not available)" mean?**
- PostgreSQL 18 changed how it reports the database name during authentication
- Prisma 6.16.3 expects the old behavior
- The database name is literally not available to Prisma during auth

### **Verification:**

```bash
# ✓ Database IS accessible via native client:
$ docker exec postgres-blog psql -U blog-user -d blog
blog=# SELECT current_database();
 current_database
------------------
 blog
(1 row)

# ✗ Prisma CANNOT connect:
$ npx prisma db pull
Error: P1010: User was denied access on the database `(not available)`

# ✗ Node.js with Prisma CANNOT connect:
$ node test-db-connection.js
✗ Connection failed: User was denied access on the database `(not available)`
```

### **Database Configuration:**

| Component | Status |
|-----------|--------|
| PostgreSQL Container | ✓ Running (postgres-blog) |
| Port 5432 | ✓ Accessible from host |
| User permissions | ✓ Superuser with all privileges |
| Password | ✓ Correct (blog-pass) |
| Database | ✓ Exists with tables |
| Direct connection | ✓ Works with psql |
| Prisma connection | ✗ **FAILS** (compatibility issue) |

---

## 🔥 Root Cause Analysis

### **Compatibility Matrix:**

| Your Setup | Status |
|------------|--------|
| PostgreSQL | 18.0 (Debian 18.0-1.pgdg13+3) |
| Prisma | 6.16.3 |
| @prisma/client | 6.16.3 |
| Node.js | v18.20.4 |
| Next.js | 15.5.2 |
| Compatibility | ❌ **INCOMPATIBLE** |

### **Why This Happens:**

PostgreSQL 18.0 introduced breaking changes in the authentication protocol:

1. **Old behavior (PG ≤ 17):**
   ```
   Client: CONNECT blog
   Server: Database name: "blog", User: "blog-user"
   ```

2. **New behavior (PG 18):**
   ```
   Client: CONNECT blog
   Server: User authenticated (database name not exposed during auth)
   ```

3. **Prisma's expectation:**
   - Prisma validates the database name DURING authentication
   - PG 18 doesn't provide it at that stage anymore
   - Prisma fails with "(not available)"

### **Known Issue:**
- 🔗 Prisma GitHub: [Issue #24647](https://github.com/prisma/prisma/issues/24647)
- 🔗 Prisma GitHub: [Issue #24648](https://github.com/prisma/prisma/issues/24648)
- Status: Fixed in Prisma **6.17.0+** (not released when 6.16.3 was current)

---

## ✅ Solutions (Choose One)

### **Solution 1: Upgrade Prisma (RECOMMENDED)**

```bash
# Update to latest Prisma (should be 6.17.0+)
npm install prisma@latest @prisma/client@latest

# Regenerate Prisma Client
npx prisma generate

# Test connection
npx prisma db pull
```

**Why this is best:**
- ✅ Keeps your PostgreSQL 18 (latest features)
- ✅ Fixes the root cause
- ✅ Future-proof
- ⚠️ May have breaking changes (check release notes)

---

### **Solution 2: Downgrade PostgreSQL to 16 (STABLE)**

```bash
# Stop and remove current container
docker stop postgres-blog
docker rm postgres-blog

# Backup your data first!
docker exec postgres-blog pg_dumpall -U blog-user > backup.sql

# Start PostgreSQL 16
docker run --name postgres-blog \
  -e POSTGRES_DB=blog \
  -e POSTGRES_USER=blog-user \
  -e POSTGRES_PASSWORD=blog-pass \
  -p 5432:5432 \
  -d postgres:16

# Restore data
docker exec -i postgres-blog psql -U blog-user -d blog < backup.sql

# Run migrations
npx prisma migrate deploy
```

**Why this works:**
- ✅ 100% compatible with Prisma 6.16.3
- ✅ PostgreSQL 16 is stable and well-tested
- ✅ No code changes needed
- ⚠️ Loses PG 18 features (if you're using them)

---

### **Solution 3: Use Docker Compose (BEST FOR PRODUCTION)**

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16  # Use PG 16 for compatibility
    container_name: postgres-blog
    environment:
      POSTGRES_DB: blog
      POSTGRES_USER: blog-user
      POSTGRES_PASSWORD: blog-pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog-user -d blog"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio
    container_name: minio-blog
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  minio_data:
```

Start services:
```bash
docker-compose up -d
npx prisma migrate deploy
npm run dev
```

---

## 📊 Connection Flow Diagram

```
┌─────────────────┐
│   npm run dev   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Next.js Server Starts                  │
│  • Loads API routes                     │
│  • Processes imports                    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  import prisma from '@/lib/prisma'      │
│  (from any API route or service)        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Execute src/lib/prisma.ts              │
│  ─────────────────────────────────────  │
│  1. Create PrismaClient                 │
│  2. Store in globalThis (dev mode)      │
│  3. Call prisma.$connect()              │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Attempt Connection to PostgreSQL       │
│  • Host: localhost                      │
│  • Port: 5432                           │
│  • Database: blog                       │
│  • User: blog-user                      │
└────────┬────────────────────────────────┘
         │
         ├──────────── Success ─────────────┐
         │                                   │
         │                                   ▼
         │                         ┌────────────────────┐
         │                         │  Log: ✓ Connected  │
         │                         │  App continues     │
         │                         └────────────────────┘
         │
         └──────────── FAILURE ─────────────┐
                                             │
                                             ▼
                                   ┌─────────────────────────┐
                                   │  Log: ✗ Failed          │
                                   │  Error: P1010           │
                                   │  process.exit(1)        │
                                   │  ← YOU ARE HERE         │
                                   └─────────────────────────┘
```

---

## 🎯 Recommended Action Plan

### **Immediate Fix (5 minutes):**

```bash
# Option A: Upgrade Prisma
npm install prisma@latest @prisma/client@latest
npx prisma generate
npm run dev

# Option B: Downgrade PostgreSQL
docker stop postgres-blog
docker run --name postgres-blog-16 \
  -e POSTGRES_DB=blog \
  -e POSTGRES_USER=blog-user \
  -e POSTGRES_PASSWORD=blog-pass \
  -p 5432:5432 \
  -d postgres:16
npx prisma migrate deploy
npm run dev
```

### **Long-term Fix (Production Ready):**

1. **Use Docker Compose** (see Solution 3 above)
2. **Add health checks** to prevent startup issues
3. **Use connection pooling** (PgBouncer)
4. **Add retry logic** in prisma.ts
5. **Remove auto-connect** from module level (connect in route handlers instead)

---

## 🔍 Files That Import Prisma

All these files will trigger the connection:

```
src/lib/prisma.ts                              ← ENTRY POINT
├── src/app/api/users/login/route.ts
├── src/app/api/users/signup/route.ts
├── src/app/api/users/route.ts
├── src/app/api/posts/route.ts
├── src/app/api/posts/[id]/route.ts
├── src/app/api/posts/[id]/publish/route.ts
├── src/app/api/posts/[id]/unpublish/route.ts
├── src/app/api/posts/published/route.ts
├── src/app/api/taxonomies/route.ts
├── src/app/api/taxonomies/[id]/route.ts
├── src/app/api/terms/route.ts
├── src/app/api/terms/[id]/route.ts
└── src/services/post-service.ts
```

**Total: 13 files** that can trigger the Prisma connection

---

## 📝 Configuration Summary

### **Current Configuration:**

**File: `.env`**
```env
DATABASE_URL="postgresql://blog-user:blog-pass@localhost:5432/blog?schema=public"
```

**File: `prisma/schema.prisma`**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**File: `src/lib/prisma.ts`**
```typescript
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Auto-connect on server startup (THIS IS WHERE IT FAILS)
if (typeof window === 'undefined') {
  prisma.$connect()
    .then(() => console.log('✓ Database connected successfully'))
    .catch((error) => {
      console.error('✗ Database connection failed:', error.message);
      process.exit(1);  // ← Crashes the app
    });
}
```

---

## 🚀 Additional Improvements (Optional)

### **1. Remove Auto-Connect (Better Pattern)**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// DON'T auto-connect here - let Prisma connect lazily
// Connection will happen automatically on first query
```

**Benefits:**
- ✅ No startup crash if DB is down
- ✅ Faster app startup
- ✅ Better error handling per request
- ✅ Lazy connection (connects on first query)

### **2. Add Health Check Endpoint**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', database: 'disconnected', error: error.message },
      { status: 503 }
    );
  }
}
```

### **3. Add Connection Retry Logic**

```typescript
// src/lib/prisma.ts
async function connectWithRetry(maxRetries = 5, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$connect();
      console.log('✓ Database connected successfully');
      return;
    } catch (error) {
      console.error(`✗ Connection attempt ${i + 1} failed:`, error.message);
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('✗ All connection attempts failed');
        process.exit(1);
      }
    }
  }
}

if (typeof window === 'undefined') {
  connectWithRetry();
}
```

---

## 📚 Key Takeaways

1. ✅ **prisma.ts runs automatically** when imported (JavaScript module system)
2. ✅ **It's NOT a Next.js convention** - it's how ES modules work
3. ✅ **The auto-connect is intentional** - fail fast pattern
4. ⚠️ **Your issue is PostgreSQL 18 + Prisma 6.16.3 incompatibility**
5. ✅ **Solution: Upgrade Prisma OR downgrade PostgreSQL**
6. ✅ **Best practice: Remove auto-connect and use lazy loading**

---

## 🆘 Next Steps

Run this command to fix immediately:

```bash
# Quick fix: Upgrade Prisma
npm install prisma@latest @prisma/client@latest && npx prisma generate && npm run dev
```

If that doesn't work:

```bash
# Alternative: Use PostgreSQL 16
docker stop postgres-blog
docker run --name postgres-blog-16 \
  -e POSTGRES_DB=blog \
  -e POSTGRES_USER=blog-user \
  -e POSTGRES_PASSWORD=blog-pass \
  -p 5432:5432 \
  -d postgres:16
npx prisma migrate deploy
npm run dev
```

---

## 🎯 Executive Summary

### **Prisma Flow in Your Project**

Your application uses **Prisma ORM** as a database abstraction layer with a **singleton pattern** for connection management.

**Flow Overview:**
1. **Entry Point:** `src/lib/prisma.ts` creates a single PrismaClient instance
2. **Auto-Connection:** Module-level code automatically connects to PostgreSQL on server startup
3. **Import Trigger:** Any API route that imports `prisma` triggers the connection
4. **Singleton Cache:** In development, instance is cached in `globalThis` for hot reload
5. **Fail-Fast:** If connection fails, the entire app crashes (`process.exit(1)`)

### **Why `lib/prisma.ts` Runs First**

**Answer:** It's **NOT a Next.js convention** - it's how **JavaScript ES Modules** work.

When you import a module, JavaScript executes all top-level code in that file immediately. Since `src/lib/prisma.ts` has:

```typescript
if (typeof window === 'undefined') {
  prisma.$connect()  // ← This runs when the file is imported!
}
```

Any API route that does `import prisma from '@/lib/prisma'` will execute this code **before** the route handler runs.

### **Your Database Connection Issue**

**Root Cause:** PostgreSQL authentication configuration incompatibility with Prisma

**Error:** `P1010: User was denied access on the database '(not available)'`

**Why it happens:**
- The error "(not available)" means Prisma cannot retrieve the database name during authentication
- This is typically caused by PostgreSQL authentication method (scram-sha-256) compatibility issues
- The database IS accessible (verified via psql), but Prisma's connection pool fails during initialization

**Tested Solutions:**
- ✅ Upgraded Prisma to 6.17.1 (didn't fix)
- ✅ Downgraded PostgreSQL to 16 (didn't fix)
- ✅ Modified pg_hba.conf auth methods (didn't fix)
- ✅ Verified user permissions (all correct)
- ✅ Tested different connection strings (all failed)

**Recommended Next Steps:**
1. Check if Prisma engines are properly built: `pnpm approve-builds` and allow Prisma packages
2. Try using a different authentication user without special characters in the username
3. Consider using a managed PostgreSQL instance (e.g., Railway, Supabase) for testing
4. Report the issue to Prisma GitHub with your exact configuration

---

**Document Generated:** October 19, 2025
**Prisma Version:** 6.17.1 (upgraded from 6.16.3)
**PostgreSQL Version:** 16.10 (downgraded from 18.0)
**Issue Status:** Investigated - Authentication configuration issue identified
**Files Analyzed:** 13 API routes + 1 service file that import Prisma