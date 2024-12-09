import express from 'express';
import renderDocentesPage from '../controllers/docentesController.js';

const router = express.Router();

// Rota para carregar a página docentes.ejs
router.get('/docentes', renderDocentesPage);

export default router;