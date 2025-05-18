"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose for Types.ObjectId
// Assuming your User model is defined in './Models/User.ts' and exports IUser and the User model
const User_1 = __importDefault(require("./Models/User"));
const router = express_1.default.Router();
// ---
// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).send(users);
    }
    catch (err) {
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.'); // Server error: Failed to retrieve data
    }
});
// ---
// Create a new user
router.post('/', async (req, res) => {
    try {
        // Type assertion for req.body for better type safety
        const { email, name, address, nickname, password, role } = req.body; // Assert req.body to IUser shape
        const user = new User_1.default({
            email,
            name,
            address,
            nickname,
            password,
            role
        });
        const savedUser = await user.save();
        res.status(201).send(savedUser); // Use 201 for resource creation
    }
    catch (err) {
        console.error('Hiba a mentés során: ', err);
        if (err.name === 'ValidationError') {
            return res.status(400).send('Mentési hiba: Érvénytelen adatok. ' + err.message); // Save error: Invalid data
        }
        // Handle potential duplicate key errors (e.g., duplicate email or nickname if unique)
        if (err.code === 11000) {
            return res.status(409).send('Mentési hiba: Az email vagy a becenév már foglalt.'); // Save error: Email or nickname already taken
        }
        res.status(400).send('Mentési hiba: ' + err.message);
    }
});
// ---
// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id); // Invalid ID format
    }
    try {
        const user = await User_1.default.findById(id); // user can be null
        if (!user) {
            return res.status(404).send('Nem található ilyen ID-val felhasználó: ' + id); // User not found with this ID
        }
        res.status(200).send(user);
    }
    catch (err) {
        console.error('Hiba a lekérdezés során: ', err);
        res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.');
    }
});
// ---
// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    try {
        const deletedUser = await User_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('Nem található ilyen ID-val felhasználó a törléshez: ' + id); // User not found with this ID for deletion
        }
        res.status(200).send(deletedUser); // Return the deleted user
    }
    catch (err) {
        console.error('Hiba a törlés során: ', err);
        res.status(500).send('Szerverhiba: Törlési hiba.'); // Server error: Deletion error
    }
});
// ---
// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Hiányzó email vagy jelszó.');
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).send('Hibás email vagy jelszó.');
        }
        // Feltételezzük, hogy a frontend SHA-256 hash-t küld (mint string)
        if (user.password !== password) {
            return res.status(401).send('Hibás email vagy jelszó.');
        }
        // Itt JWT-t is küldhetnél, de most csak visszaküldjük a felhasználót
        return res.status(200).send({
            message: 'Sikeres bejelentkezés',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error('Bejelentkezési hiba: ', err);
        return res.status(500).send('Szerverhiba a bejelentkezés során.');
    }
});
// ---
// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    const updateData = req.body; // Use Partial<IUser> as not all fields may be in the update request
    try {
        const updatedUser = await User_1.default.findByIdAndUpdate(id, { $set: updateData }, // Use $set to update only provided fields
        { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
        );
        if (!updatedUser) {
            return res.status(404).send('Nem található ilyen ID-val felhasználó a frissítéshez: ' + id); // User not found with this ID for update
        }
        res.status(200).send(updatedUser);
    }
    catch (err) {
        console.error('Hiba a frissítés során: ', err);
        if (err.name === 'ValidationError') {
            return res.status(400).send('Frissítési hiba: Érvénytelen adatok. ' + err.message); // Update error: Invalid data
        }
        if (err.code === 11000) {
            return res.status(409).send('Frissítési hiba: Az email vagy a becenév már foglalt.'); // Update error: Email or nickname already taken
        }
        res.status(500).send('Szerverhiba: Frissítési hiba.'); // Server error: Update error
    }
});
exports.default = router;
