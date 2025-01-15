import express from "express";
import cardapioController from "../controllers/cardapioController.js";

const cardapioRouter = express.Router();

/* Renderizar a página do cardápio */
cardapioRouter.get('/cardapio', cardapioController.renderCardapioPage);

/* --- ENDPOINTS --- */
    /* 1º Endpoint: Cadastrar dia (Single) */
    cardapioRouter.post("/diacardapio", cardapioController.createNewCardapio);

    /* 2º Endpoint: Cadastrar dia (Multi) */
    cardapioRouter.post("/multicardapio", cardapioController.createMultipleDays);

    /* 3º Endpoint: Listar todos */
    cardapioRouter.get("/diascardapio", cardapioController.getAllCardapios);

    /* 4º Endpoint: Listar um */
    cardapioRouter.get("/diacardapio/:id", cardapioController.getOneCardapio);

    /* 5º Endpoint: Editar */
    cardapioRouter.patch("/diacardapio/:id", cardapioController.updateCardapio);

    /* 6º Endpoint: Deletar */
    cardapioRouter.delete("/diacardapio/:id", cardapioController.deleteCardapio);

export default cardapioRouter;