"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose itself for Types.ObjectId
// Assuming your Plant model is defined in './Models/Plant.ts' and exports IPlant and the Plant model
const Plant_1 = __importDefault(require("./Models/Plant"));
const router = express_1.default.Router();
// ---
// Get all plants
router.get('/', async (req, res) => {
    try {
        const plants = await Plant_1.default.find();
        res.status(200).send(plants);
    }
    catch (err) { // Catching 'any' as Express errors can vary
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.'); // Server error: Failed to retrieve data
    }
});
// ---
// Create a new plant
router.post('/', async (req, res) => {
    try {
        // Type assertion for req.body for better type safety
        const { commonName, scientificName, description, careInstructions, pestInfo, userId, isVerified } = req.body; // Assert req.body to IPlant shape
        const plant = new Plant_1.default({
            commonName,
            scientificName,
            description,
            careInstructions,
            pestInfo,
            userId,
            isVerified
        });
        const savedPlant = await plant.save();
        res.status(201).send(savedPlant); // Use 201 for resource creation
    }
    catch (err) {
        console.error('Hiba a mentés során: ', err);
        // Mongoose validation errors often have a 'name' property
        if (err.name === 'ValidationError') {
            return res.status(400).send('Mentési hiba: Érvénytelen adatok. ' + err.message); // Save error: Invalid data
        }
        res.status(400).send('Mentési hiba: ' + err.message);
    }
});
// ---
// Get a plant by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id); // Invalid ID format
    }
    try {
        const plant = await Plant_1.default.findById(id); // plant can be null
        if (!plant) {
            return res.status(404).send('Nem található ilyen ID-val növény: ' + id); // Plant not found with this ID
        }
        res.status(200).send(plant);
    }
    catch (err) {
        console.error('Hiba a lekérdezés során: ', err);
        res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.');
    }
});
// ---
// Delete a plant by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    try {
        const deletedPlant = await Plant_1.default.findByIdAndDelete(id);
        if (!deletedPlant) {
            return res.status(404).send('Nem található ilyen ID-val növény a törléshez: ' + id); // Plant not found with this ID for deletion
        }
        res.status(200).send(deletedPlant); // Return the deleted plant
    }
    catch (err) {
        console.error('Hiba a törlés során: ', err);
        res.status(500).send('Szerverhiba: Törlési hiba.'); // Server error: Deletion error
    }
});
// ---
// Update a plant by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    const updateData = req.body; // Use Partial<IPlant> as not all fields may be in the update request
    try {
        const updatedPlant = await Plant_1.default.findByIdAndUpdate(id, { $set: updateData }, // Use $set to update only provided fields
        { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
        );
        if (!updatedPlant) {
            return res.status(404).send('Nem található ilyen ID-val növény a frissítéshez: ' + id); // Plant not found with this ID for update
        }
        res.status(200).send(updatedPlant);
    }
    catch (err) {
        console.error('Hiba a frissítés során: ', err);
        if (err.name === 'ValidationError') {
            return res.status(400).send('Frissítési hiba: Érvénytelen adatok. ' + err.message); // Update error: Invalid data
        }
        res.status(500).send('Szerverhiba: Frissítési hiba.'); // Server error: Update error
    }
});
exports.default = router;
