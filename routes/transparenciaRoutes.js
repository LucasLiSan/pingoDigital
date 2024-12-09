import express from 'express';
import transparenciaController from '../controllers/transparenciaController.js';

const router = express.Router();

// Rota para carregar a página docentes.ejs
router.get('/transparencia', transparenciaController);

export default router;