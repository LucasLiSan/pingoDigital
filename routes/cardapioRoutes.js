import express from 'express';
import cardapioController from '../controllers/cardapioController.js';

const router = express.Router();

// Rota para carregar a página cardapio.ejs
router.get('/cardapio', cardapioController);

export default router;