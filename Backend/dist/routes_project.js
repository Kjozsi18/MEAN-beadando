"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const Project_1 = __importDefault(require("./Models/Project"));
const router = express_1.default.Router();
// GET all projects
router.get('/', async (_req, res) => {
    try {
        const projects = await Project_1.default.find().lean();
        res.send(projects);
    }
    catch (err) {
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba');
    }
});
// Create a new project
router.post('/', async (req, res) => {
    try {
        const newProjectData = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            relatedPlants: req.body.relatedPlants,
        };
        const project = new Project_1.default(newProjectData);
        const savedProject = await project.save();
        res.status(201).send(savedProject);
    }
    catch (err) {
        console.error('Hiba a mentés során: ', err);
        res.status(400).send('Mentési hiba: ' + err.message);
    }
});
// GET a project by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    try {
        const project = await Project_1.default.findById(id).lean();
        if (!project) {
            return res.status(404).send('Nem található ilyen ID-val: ' + id);
        }
        res.send(project);
    }
    catch (err) {
        console.error('Hiba a lekérdezés során: ', err);
        res.status(500).send('Szerverhiba');
    }
});
// Projects lekérése userId alapján
router.get('/all/:userId', async (req, res) => {
    const { userId } = req.params; // Kinyerjük a userId-t az URL-ből
    try {
        const projects = await Project_1.default.find({ userId: userId }).lean();
        if (projects.length === 0) {
            return res.status(404).send(`Nem található projekt ezzel a felhasználó ID-val: ${userId}`);
        }
        res.send(projects);
    }
    catch (err) {
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba');
    }
});
// DELETE a project by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    try {
        const deletedProject = await Project_1.default.findByIdAndDelete(id).lean();
        if (!deletedProject) {
            return res.status(404).send('Nem található ilyen ID-val: ' + id);
        }
        res.send(deletedProject);
    }
    catch (err) {
        console.error('Hiba a törlés során: ', err);
        res.status(500).send('Szerverhiba');
    }
});
// UPDATE a project by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    const update = {
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        relatedPlants: req.body.relatedPlants,
    };
    try {
        const updatedProject = await Project_1.default.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
        if (!updatedProject) {
            return res.status(404).send('Nem található ilyen ID-val: ' + id);
        }
        res.send(updatedProject);
    }
    catch (err) {
        console.error('Hiba a frissítés során: ', err);
        res.status(500).send('Szerverhiba');
    }
});
exports.default = router;
