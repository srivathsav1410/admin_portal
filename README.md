# Recycle Admin (React + Vite + MUI)

A minimal admin UI with:
- Login page
- Home page with a grid (UserId, AddressToPickup, Quantity, Status, OrderAt, CompletedAt)
- Edit Status via dialog

## Run locally

```bash
npm install
npm start   # or: npm run dev
```

Open http://localhost:5173

**Login credentials**
- Username: `admin`
- Password: `1234`

## Build for production
```bash
npm run build
npm run preview
```

## Notes
- Data is mocked in-memory. Replace with your API calls in `src/pages/Home.jsx`.
- Replace hardcoded login with real authentication when you connect your backend.
"# admin_portal" 
