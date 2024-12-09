import express from 'express';
import renderSobrePage from '../controllers/sobreController.js';

const router = express.Router();

// Rota para carregar a página sobre.ejs
router.get('/sobre', renderSobrePage);

export default router;