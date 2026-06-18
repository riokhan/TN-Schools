# Google Cloud SQL Setup — TN Schools AI Ecosystem
## Your Instance Configuration

| Setting | Value |
|---|---|
| **Instance ID** | `free-trial-first-project` |
| **Region** | `us-central1` (Iowa) |
| **Database Engine** | PostgreSQL |
| **Admin User** | `postgres` |
| **Password** | `0=]k$u&6X6(*hx@G` |
| **Database Name** | `tn_schools_ecosystem` |

---

## Step 1: Create the Free Instance

You are on the Cloud SQL free trial creation page. Click **"Create free instance"** and wait ~5 minutes.

---

## Step 2: Get Your Public IP Address

1. Go to **Cloud Console → SQL → free-trial-first-project → Overview**
2. Under **"Connect to this instance"**, copy the **Public IP address** (e.g. `34.123.xx.xx`)

---

## Step 3: Create the Database

Once the instance is ready, open **Cloud Shell** or **Cloud SQL Studio** and run:

```sql
CREATE DATABASE tn_schools_ecosystem;
```

Or via gcloud CLI:
```bash
gcloud sql databases create tn_schools_ecosystem \
  --instance=free-trial-first-project \
  --project=YOUR_PROJECT_ID
```

---

## Step 4: Authorize Your IP for Connection

1. Cloud Console → SQL → `free-trial-first-project` → **Connections** → **Networking**
2. Under **Authorized networks** → click **Add network**
3. Name: `My Dev Machine`
4. Network: Enter your public IP (visit [whatismyip.com](https://whatismyip.com) to find it)
5. Click **Done → Save**

---

## Step 5: Update `backend/.env`

Open [backend/.env](file:///d:/cab-work/tn-school/backend/.env) and replace `PASTE_PUBLIC_IP_HERE` with the actual IP:

```env
CLOUD_SQL_PUBLIC_IP="34.123.xx.xx"
POSTGRES_URI="postgresql://postgres:0%3D%5Dk%24u%266X6\(*hx%40G@34.123.xx.xx:5432/tn_schools_ecosystem?sslmode=require"
```

> **Note**: The password is URL-encoded. Special characters:
> - `=` → `%3D`
> - `]` → `%5D`
> - `$` → `%24`
> - `&` → `%26`
> - `@` → `%40`

---

## Step 6: Run Prisma Migration

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

This will create all 10 tables in your Cloud SQL PostgreSQL instance:
- `User`, `School`, `Student`, `Teacher`
- `Mark`, `Attendance`, `Timetable`
- `Scholarship`, `MidDayMeal`, `SchoolAsset`

---

## Step 7: Seed Demo Data (Optional)

```bash
npx ts-node src/seed.ts
```

*(Seed file will be created in the next step)*

---

## Step 8: Start the Backend

```bash
cd backend
npm run dev
```

Visit `http://localhost:5000` — you should see:
```json
{
  "status": "ok",
  "databases": {
    "mongodb": "connected",
    "postgresql": "connected"
  }
}
```

---

## Production Setup (Cloud Run / GKE)

For production, **do NOT use public IP**. Use Cloud SQL Auth Proxy instead:

```bash
# Install proxy
gcloud components install cloud_sql_proxy

# Run proxy (exposes Cloud SQL as localhost:5432)
cloud_sql_proxy -instances=YOUR_PROJECT_ID:us-central1:free-trial-first-project=tcp:5432
```

Then update `.env`:
```env
POSTGRES_URI="postgresql://postgres:0%3D%5Dk%24u%266X6\(*hx%40G@127.0.0.1:5432/tn_schools_ecosystem"
```

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Connection refused` | Your IP not in authorized networks |
| `SSL required` | Add `?sslmode=require` to connection string |
| `Database does not exist` | Run `CREATE DATABASE tn_schools_ecosystem;` first |
| `Password authentication failed` | Check URL-encoding of special chars in password |
