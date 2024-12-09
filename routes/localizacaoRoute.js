import express from 'express';
import renderLocalizacaoPage from '../controllers/localizacaoController.js';

const router = express.Router();

// Rota para carregar a página localizacao.ejs
router.get('/localizacao', renderLocalizacaoPage);

export default router;