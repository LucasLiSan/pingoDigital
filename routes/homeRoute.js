import express from 'express';
import renderHomePage from '../controllers/homeController.js';

const router = express.Router();

// Rota para carregar a página home.ejs
router.get('/home', renderHomePage);

export default router;