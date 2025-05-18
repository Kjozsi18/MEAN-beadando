import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import Project, { IProject } from './Models/Project';

const router = express.Router();

// GET all projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const projects: IProject[] = await Project.find().lean();
    res.send(projects);
  } catch (err) {
    console.error('Hiba az adatok lekérése során: ', err);
    res.status(500).send('Szerverhiba');
  }
});

// Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const newProjectData: IProject = {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      relatedPlants: req.body.relatedPlants,
    };

    const project = new Project(newProjectData);
    const savedProject = await project.save();
    res.status(201).send(savedProject);
  } catch (err: any) {
    console.error('Hiba a mentés során: ', err);
    res.status(400).send('Mentési hiba: ' + err.message);
  }
});

// GET a project by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  try {
    const project: IProject | null = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).send('Nem található ilyen ID-val: ' + id);
    }
    res.send(project);
  } catch (err) {
    console.error('Hiba a lekérdezés során: ', err);
    res.status(500).send('Szerverhiba');
  }
});


// Projects lekérése userId alapján
router.get('/all/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params; // Kinyerjük a userId-t az URL-ből
    try {
        const projects: IProject[] = await Project.find({ userId: userId }).lean();

        if (projects.length === 0) {
            return res.status(404).send(`Nem található projekt ezzel a felhasználó ID-val: ${userId}`);
        }

        res.send(projects);
    } catch (err) {
        console.error('Hiba az adatok lekérése során: ', err);
        res.status(500).send('Szerverhiba');
    }
});

// DELETE a project by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send('Érvénytelen ID formátum: ' + id);
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(id).lean();
    if (!deletedProject) {
      return res.status(404).send('Nem található ilyen ID-val: ' + id);
    }
    res.send(deletedProject);
  } catch (err) {
    console.error('Hiba a törlés során: ', err);
    res.status(500).send('Szerverhiba');
  }
});

// UPDATE a project by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
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
    const updatedProject = await Project.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!updatedProject) {
      return res.status(404).send('Nem található ilyen ID-val: ' + id);
    }
    res.send(updatedProject);
  } catch (err) {
    console.error('Hiba a frissítés során: ', err);
    res.status(500).send('Szerverhiba');
  }
});

export default router;