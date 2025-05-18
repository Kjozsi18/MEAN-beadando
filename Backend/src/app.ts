import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Mongoose automatikusan inicializálva a `db.ts` betöltésével
import './db';

// A route-ok importálása relatív útvonallal a projekt struktúrájához képest
import router from './routes';
import router_user from './routes_user';
import router_plant from './routes_plant';
import router_project from './routes_project';

const app: Application = express();

// Middleware konfigurálása
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// Route-ok regisztrálása
app.use('/post', router);
app.use('/user', router_user);
app.use('/plant', router_plant);
app.use('/project', router_project);

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server elindult a ${PORT}-es porton`);
});
