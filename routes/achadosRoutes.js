import express from 'express';
import renderAchadosPage from '../controllers/achadosController.js';

const router = express.Router();

// Rota para carregar a página sobre.ejs
router.get('/achados', renderAchadosPage);

export default router;