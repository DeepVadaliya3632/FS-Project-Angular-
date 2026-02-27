import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {getResume, getUserResumes, getResumeById, updateResume, deleteResume} from '../controller/resumeController.js';
import { uploadResumeImages } from '../controller/uploadImages.js';

const resumeRouter = express.Router();

resumeRouter.post('/', protect, getResume);

resumeRouter.get('/', protect, getUserResumes);
resumeRouter.get('/:id', protect, getResumeById);

resumeRouter.put('/:id', protect, updateResume);
resumeRouter.put('/:id/upload-images', protect, uploadResumeImages);

resumeRouter.delete('/:id', protect, deleteResume);

export default resumeRouter;