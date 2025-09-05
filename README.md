# Role-Based Management Frontend (React + Vite + Tailwind)

This project is wired to your backend controllers:
- `AuthController` → `/api/Auth/login`, `/api/Auth/register`, `/api/Auth/current-user`
- `UserController` → `/api/user`
- `RoleController` → `/api/role`
- `PermissionController` → `/api/permission`

## Quick Start

1. Install dependencies:
   ```bash
   npm i
   ```

2. Create `.env` at the project root:
   ```bash
   VITE_API_URL=https://localhost:5001/api
   ```
   Adjust the URL to match your backend origin.

3. Run the app:
   ```bash
   npm run dev
   ```

4. Default login payload example (Swagger-style):
   ```json
   { "username": "admin", "password": "Admin123!" }
   ```

If your backend uses a different "me" endpoint than `/api/Auth/current-user`, change it in `src/services/authservice.js`.
