import express from 'express';
import calendarioController from '../controllers/calendarioController.js';

const router = express.Router();

// Rota para carregar a página calendario.ejs
router.get('/calendario', calendarioController);

export default router;