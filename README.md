# Exercise

Search, filter, and sort dengue infection indicators through a responsive web interface backed by REST APIs.

## 1. How To Start

### Prerequisites

- Node.js 20 LTS
- Ports 8000 (Backend API) and 3000 (Nuxt dev server) are available

### Start

Use two terminals.

Terminal 1 (backend):

```
cd backend
npm install
npm start
```

Verify the backend is running by opening http://localhost:8000/status — it should return:

```json
{ "status": "Running", "timestamp": "..." }
```

Terminal 2 (website):

```
cd website
npm install
npm run dev
```

Open http://localhost:3000 in the browser to see the page.

## 2. Tech Stack

Backend:

- Node.js
- Express 5
- Sequelize 6
- SQLite3

Website:

- Nuxt 4
- Vue 3
- TypeScript
- Vuetify 4

Data/Storage:

- SQLite database seeded from local JSON storage files

## Outstanding work

1. Page navigation is missing.
