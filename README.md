# Overall360 · Transcend Alumni Portal

React (Vite) frontend + Express API with **MongoDB** as the main database.

## Run it

1. Install dependencies: `npm install`
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`
   - Local MongoDB: `mongodb://127.0.0.1:27017/overall360`
   - MongoDB Atlas: your `mongodb+srv://…` connection string
   - No MongoDB installed yet? Set `USE_MEMORY_DB=true` for a throwaway in-memory database.
3. Start API + web together: `npm run dev:all` (or `npm run server` and `npm run dev` in two terminals)
4. Open http://localhost:5173/login

On first start, an empty database is seeded with the portal content and demo accounts.
The credentials come from the `SEED_*` values in `server/.env`. To wipe the data and seed it again, run `npm run reseed`.

## How data flows

| Collection | Contents |
|---|---|
| `users` | Every account that can sign in (bcrypt-hashed passwords; 4-digit PINs for wardens and mess staff) |
| `alumni`, `pending_profiles` | Approved alumni and access requests waiting for review |
| `events`, `posts`, `achievements`, `broadcasts`, `notifications`, `birthday_logs` | Portal content |
| `settings` | Birthday automation settings and the birthday wish ledger |

- `GET /api/data` loads everything; `PUT /api/data/:collection` saves one collection.
- `POST /api/auth/login`, `POST /api/auth/pin`, and `POST /api/auth/register` handle sign-in and access requests.
- The frontend (`src/context/DataContext.jsx`) loads from MongoDB on startup and saves changes back to it automatically.
  localStorage is kept only as an offline cache.

## Deploying

The frontend on Vercel needs the API hosted separately (Render, Railway, etc.).
Set `VITE_API_URL` to the API's address when building the frontend, and set `CLIENT_ORIGIN` on the API.
