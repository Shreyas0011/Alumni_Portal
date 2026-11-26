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
The password comes from `SEED_DEMO_PASSWORD` in `server/.env`. To wipe the data and seed it again, run `npm run reseed`.

## Roles and access (RBAC)

The sign-in page is the first page. Each role has its own email, and the server decides the role from the account:

| Email | Role | Lands on |
|---|---|---|
| `superadmin@transcendgroup.org` | Super Admin | Admin portal (`/admin`) |
| `admin@transcendgroup.org` | Admin | Admin portal (`/admin`) |
| `professor@transcendgroup.org` | Professor | Faculty portal (`/professor/dashboard`) |
| `student@transcendgroup.org` | Student | Student portal (profile completion first) |
| Seeded alumni emails, e.g. `priya@goldman.com` | Alumni | Alumni portal (`/alumni/dashboard`) |

Sign-in returns a session token (JWT, signed with `JWT_SECRET`). Every API call checks it:
admins can change everything; other roles can only register for events, submit posts and
their own profile. Pages are guarded the same way in the browser (`src/lib/roles.js`).

## How data flows

| Collection | Contents |
|---|---|
| `users` | Every account that can sign in, with its role (bcrypt-hashed passwords) |
| `alumni`, `pending_profiles` | Approved alumni and access requests waiting for review |
| `events`, `posts`, `achievements`, `broadcasts`, `notifications`, `birthday_logs` | Portal content |
| `settings` | Birthday automation settings and the birthday wish ledger |

- `GET /api/data` loads everything; `PUT /api/data/:collection` saves one collection.
- `POST /api/auth/login`, `POST /api/auth/register` and `POST /api/auth/profile` handle sign-in, access requests and profile submissions.
- The frontend (`src/context/DataContext.jsx`) loads from MongoDB on startup and saves changes back to it automatically.
  localStorage is kept only as an offline cache.

## Deploying

The frontend on Vercel needs the API hosted separately (Render, Railway, etc.).
Set `VITE_API_URL` to the API's address when building the frontend, and set `CLIENT_ORIGIN` on the API.
