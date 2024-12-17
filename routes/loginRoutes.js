import express from 'express';
import loginController from '../controllers/loginController.js';

const router = express.Router();

// Rota para carregar a página docentes.ejs
router.get('/login', loginController);

export default router;