"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// Mongoose automatikusan inicializálva a `db.ts` betöltésével
require("./db");
// A route-ok importálása relatív útvonallal a projekt struktúrájához képest
const routes_1 = __importDefault(require("./routes"));
const routes_user_1 = __importDefault(require("./routes_user"));
const routes_plant_1 = __importDefault(require("./routes_plant"));
const routes_project_1 = __importDefault(require("./routes_project"));
const app = (0, express_1.default)();
// Middleware konfigurálása
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:4200' }));
// Route-ok regisztrálása
app.use('/post', routes_1.default);
app.use('/user', routes_user_1.default);
app.use('/plant', routes_plant_1.default);
app.use('/project', routes_project_1.default);
// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server elindult a ${PORT}-es porton`);
});
