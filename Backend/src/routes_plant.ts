import express, { Request, Response } from 'express';
import mongoose from 'mongoose'; // Import mongoose itself for Types.ObjectId

// Assuming your Plant model is defined in './Models/Plant.ts' and exports IPlant and the Plant model
import Plant, { IPlant } from './Models/Plant';

const router = express.Router();

// ---
// Get all plants
router.get('/', async (req: Request, res: Response) => {
  try {
    const plants: IPlant[] = await Plant.find();
    res.status(200).send(plants);
  } catch (err: any) { // Catching 'any' as Express errors can vary
    console.error('Hiba az adatok lekérése során: ', err);
    res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.'); // Server error: Failed to retrieve data
  }
});

// ---
// Create a new plant
router.post('/', async (req: Request, res: Response) => {
  try {
    // Type assertion for req.body for better type safety
    const {
      commonName,
      scientificName,
      description,
      careInstructions,
      pestInfo,
      userId,
      isVerified
    } = req.body as IPlant; // Assert req.body to IPlant shape

    const plant = new Plant({
      commonName,
      scientificName,
      description,
      careInstructions,
      pestInfo,
      userId,
      isVerified
    });

    const savedPlant: IPlant = await plant.save();
    res.status(201).send(savedPlant); // Use 201 for resource creation
  } catch (err: any) {
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
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id); // Invalid ID format
  }

  try {
    const plant: IPlant | null = await Plant.findById(id); // plant can be null
    if (!plant) {
      return res.status(404).send('Nem található ilyen ID-val növény: ' + id); // Plant not found with this ID
    }
    res.status(200).send(plant);
  } catch (err: any) {
    console.error('Hiba a lekérdezés során: ', err);
    res.status(500).send('Szerverhiba: Az adatok lekérdezése sikertelen.');
  }
});

// ---
// Delete a plant by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  try {
    const deletedPlant: IPlant | null = await Plant.findByIdAndDelete(id);
    if (!deletedPlant) {
      return res.status(404).send('Nem található ilyen ID-val növény a törléshez: ' + id); // Plant not found with this ID for deletion
    }
    res.status(200).send(deletedPlant); // Return the deleted plant
  } catch (err: any) {
    console.error('Hiba a törlés során: ', err);
    res.status(500).send('Szerverhiba: Törlési hiba.'); // Server error: Deletion error
  }
});

// ---
// Update a plant by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  const updateData: Partial<IPlant> = req.body; // Use Partial<IPlant> as not all fields may be in the update request

  try {
    const updatedPlant: IPlant | null = await Plant.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only provided fields
      { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
    );

    if (!updatedPlant) {
      return res.status(404).send('Nem található ilyen ID-val növény a frissítéshez: ' + id); // Plant not found with this ID for update
    }
    res.status(200).send(updatedPlant);
  } catch (err: any) {
    console.error('Hiba a frissítés során: ', err);
    if (err.name === 'ValidationError') {
      return res.status(400).send('Frissítési hiba: Érvénytelen adatok. ' + err.message); // Update error: Invalid data
    }
    res.status(500).send('Szerverhiba: Frissítési hiba.'); // Server error: Update error
  }
});

export default router;