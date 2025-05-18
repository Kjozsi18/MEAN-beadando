import express, { Request, Response } from 'express';
import mongoose from 'mongoose'; // Import mongoose for Types.ObjectId

// Assuming your Post model is defined in './Models/Post.ts' and exports IPost and the Post model
import Post, { IPost } from './Models/Post';

const router = express.Router();

// ---
// Get all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts: IPost[] = await Post.find();
    res.status(200).send(posts);
  } catch (err: any) {
    console.error('Hiba az adatok lekérése során: ', err);
    res.status(500).send('Szerverhiba: A posztok lekérdezése sikertelen.'); // Server error: Failed to retrieve posts
  }
});

// ---
// Create a new post
router.post('/', async (req: Request, res: Response) => {
  try {
    // Type assertion for req.body for better type safety
    const {
      title,
      content,
      username
    } = req.body as IPost; // Assert req.body to IPost shape

    const post = new Post({
      title,
      content,
      username
    });

    const savedPost: IPost = await post.save();
    res.status(201).send(savedPost); // Use 201 for resource creation
  } catch (err: any) {
    console.error('Hiba a mentés során: ', err);
    if (err.name === 'ValidationError') {
      return res.status(400).send('Mentési hiba: Érvénytelen adatok. ' + err.message); // Save error: Invalid data
    }
    res.status(400).send('Mentési hiba: ' + err.message);
  }
});

// ---
// Get a post by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id); // Invalid ID format
  }

  try {
    const post: IPost | null = await Post.findById(id); // post can be null
    if (!post) {
      return res.status(404).send('Nem található ilyen ID-val poszt: ' + id); // Post not found with this ID
    }
    res.status(200).send(post);
  } catch (err: any) {
    console.error('Hiba a lekérdezés során: ', err);
    res.status(500).send('Szerverhiba: A poszt lekérdezése sikertelen.');
  }
});

// ---
// Delete a post by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  try {
    const deletedPost: IPost | null = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).send('Nem található ilyen ID-val poszt a törléshez: ' + id); // Post not found with this ID for deletion
    }
    res.status(200).send(deletedPost); // Return the deleted post
  } catch (err: any) {
    console.error('Hiba a törlés során: ', err);
    res.status(500).send('Szerverhiba: Törlési hiba.'); // Server error: Deletion error
  }
});

// ---
// Update a post by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  const updateData: Partial<IPost> = req.body; // Use Partial<IPost> as not all fields may be in the update request

  try {
    const updatedPost: IPost | null = await Post.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only provided fields
      { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
    );

    if (!updatedPost) {
      return res.status(404).send('Nem található ilyen ID-val poszt a frissítéshez: ' + id); // Post not found with this ID for update
    }
    res.status(200).send(updatedPost);
  } catch (err: any) {
    console.error('Hiba a frissítés során: ', err);
    if (err.name === 'ValidationError') {
      return res.status(400).send('Frissítési hiba: Érvénytelen adatok. ' + err.message); // Update error: Invalid data
    }
    res.status(500).send('Szerverhiba: Frissítési hiba.'); // Server error: Update error
  }
});

export default router;