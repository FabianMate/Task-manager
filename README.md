# Task Manager Backend

Egyszerű Express + SQLite REST API a Task Manager projekthez.

## Indítás

```bash
npm install
npm start
```

A backend ezután a `http://localhost:3000` címen fut.

## API

- `GET /api/tasks` – feladatok listázása
- `GET /api/tasks/:id` – egy feladat lekérése
- `POST /api/tasks` – új feladat
- `PUT /api/tasks/:id` – feladat módosítása
- `DELETE /api/tasks/:id` – feladat törlése
- `GET /api/tasks?status=todo` – státusz szerinti szűrés

Státuszok: `todo`, `in_progress`, `done`
