"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose for Types.ObjectId
// Assuming your Post model is defined in './Models/Post.ts' and exports IPost and the Post model
const Post_1 = __importDefault(require("./Models/Post"));
const router = express_1.default.Router();
// ---
// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post_1.default.find();
        res.status(200).send(posts);
    }
    catch (err) {
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba: A posztok lekérdezése sikertelen.'); // Server error: Failed to retrieve posts
    }
});
// ---
// Create a new post
router.post('/', async (req, res) => {
    try {
        // Type assertion for req.body for better type safety
        const { title, content, username } = req.body; // Assert req.body to IPost shape
        const post = new Post_1.default({
            title,
            content,
            username
        });
        const savedPost = await post.save();
        res.status(201).send(savedPost); // Use 201 for resource creation
    }
    catch (err) {
        console.error('Hiba a mentés során: ', err);
        if (err.name === 'ValidationError') {
            return res.status(400).send('Mentési hiba: Érvénytelen adatok. ' + err.message); // Save error: Invalid data
        }
        res.status(400).send('Mentési hiba: ' + err.message);
    }
});
// ---
// Get a post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id); // Invalid ID format
    }
    try {
        const post = await Post_1.default.findById(id); // post can be null
        if (!post) {
            return res.status(404).send('Nem található ilyen ID-val poszt: ' + id); // Post not found with this ID
        }
        res.status(200).send(post);
    }
    catch (err) {
        console.error('Hiba a lekérdezés során: ', err);
        res.status(500).send('Szerverhiba: A poszt lekérdezése sikertelen.');
    }
});
// ---
// Delete a post by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    try {
        const deletedPost = await Post_1.default.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).send('Nem található ilyen ID-val poszt a törléshez: ' + id); // Post not found with this ID for deletion
        }
        res.status(200).send(deletedPost); // Return the deleted post
    }
    catch (err) {
        console.error('Hiba a törlés során: ', err);
        res.status(500).send('Szerverhiba: Törlési hiba.'); // Server error: Deletion error
    }
});
// ---
// Update a post by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Érvénytelen ID formátum: ' + id);
    }
    const updateData = req.body; // Use Partial<IPost> as not all fields may be in the update request
    try {
        const updatedPost = await Post_1.default.findByIdAndUpdate(id, { $set: updateData }, // Use $set to update only provided fields
        { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
        );
        if (!updatedPost) {
            return res.status(404).send('Nem található ilyen ID-val poszt a frissítéshez: ' + id); // Post not found with this ID for update
        }
        res.status(200).send(updatedPost);
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
