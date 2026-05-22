# How to Run — separated Frontend & Backend

This project has been separated into two independent directories to isolate the calculation engine & CMS API (Backend) from the wizard user interface (Frontend).

- **Backend (API & CMS):** Runs on `http://localhost:3000`
- **Frontend (Wizard UI):** Runs on `http://localhost:3001`

---

## 1. Prerequisites

- **Node.js** v20 or newer (`node -v`)
- **npm** v9 or newer (`npm -v`)
- **SQLite** (Bundled inside the backend, uses local file database)

---

## 2. Directory Structure

```
.
├── backend/            # Payload CMS, SQLite DB, Calculations & APIs
└── frontend/           # Next.js client-side calculator wizard UI
```

---

## 3. Backend Setup & Run

Open a terminal window and navigate to the `backend/` directory:

```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Setup environment variables
A `.env` file should be located in `backend/`. If it is missing, create it from `.env.example`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
DATABASE_URI=file:./sustally-scope1.db
PAYLOAD_SECRET=a-secure-payload-cms-secret-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run the backend (dev mode)
```bash
npm run dev
```
The backend and Payload CMS dashboard will start.
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin) (Set up your admin account on first load)
- **API Status Page:** [http://localhost:3000](http://localhost:3000)

### Seed the factors database
To populate emission factors for calculations, run the seed script once:
```bash
npm run seed
```

### Run backend tests
To run the calculation engine unit tests (Vitest):
```bash
npm run test
```

---

## 4. Frontend Setup & Run

Open a *new* terminal window and navigate to the `frontend/` directory:

```bash
cd frontend
```

### Install dependencies
```bash
npm install
```

### Setup environment variables
A `.env` file should be located in `frontend/`. If it is missing, create it from `.env.example`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
This tells the client UI where to reach the backend APIs.

### Run the frontend (dev mode)
```bash
npm run dev
```
The frontend wizard UI will start on port 3001:
- **Calculator Wizard UI:** [http://localhost:3001](http://localhost:3001)

---

## 5. Development Details

- **CORS Handling:** The backend is configured with custom CORS middleware (`backend/src/middleware.ts`) and Payload settings to allow cross-origin requests from `http://localhost:3001`.
- **API Endpoints:**
  - `GET http://localhost:3000/api/v1/factors` — Retrieves emission factors library.
  - `POST http://localhost:3000/api/v1/calculations/cement/validate` — Performs live inputs validation.
  - `POST http://localhost:3000/api/v1/calculations/cement/calculate` — Performs calculations.
  - `POST http://localhost:3000/api/v1/calculations/export` — Generates PDF, XLSX, or JSON reports.
