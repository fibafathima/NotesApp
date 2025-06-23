# Notes Manager

A clean, full-stack notes app where users can write, edit, delete, and organize notes. Features include tags, pinning favorites, authentication, and a beautiful dark theme.

## Features
- User authentication (register/login)
- Create, edit, delete notes
- Organize notes with tags
- Pin/unpin favorite notes
- Filter notes by tag
- Responsive dark-themed UI (Tailwind CSS)

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT

---

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### 1. Clone the repository
```
git clone <repo-url>
cd Notepad app
```

### 2. Backend Setup
```
cd server
npm install
```
Create a `.env` file in the `server` folder:
```
MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=supersecretkey
PORT=5000
```
Start the backend:
```
node index.js
# or for auto-reload
npm install -g nodemon
nodemon index.js
```

### 3. Frontend Setup
```
cd ../client
npm install
npm start
```
The app will run at [http://localhost:3000](http://localhost:3000)

---

## Usage
- Register a new account or login
- Create, edit, delete, pin, and tag notes
- Filter notes by tag
- Logout when done

---

## Deployment
- For production, build the React app:
  ```
  npm run build
  ```
- Deploy the backend and frontend build folder to your preferred platform (Render, Vercel, Heroku, etc.)

---

## License
MIT 