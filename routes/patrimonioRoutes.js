import express from "express";
import patrimonioController from "../controllers/patrimonioController.js";

const patrimonioRoutes = express.Router();

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo item de patrimônio */
patrimonioRoutes.post("/patrimonio", patrimonioController.createNewPat);

/* 2º Endpoint: Listar todos os itens de patrimônio */
patrimonioRoutes.get("/patrimonios", patrimonioController.gettAllPats);

/* 3º Endpoint: Listar um item específico de patrimônio pelo código */
patrimonioRoutes.get("/patrimonio/:patCode", patrimonioController.getOnePat);

/* 4º Endpoint: Atualizar um item de patrimônio pelo codPat */
patrimonioRoutes.patch("/patrimonio/:codPat", patrimonioController.updatePat);

/* 5º Endpoint: Atualizar movimentação do item de patrimônio */
patrimonioRoutes.patch("/patrimonio/:codPat/movimentar", patrimonioController.updateMove);

/* 6º Endpoint: Deletar um item de patrimônio pelo ID */
patrimonioRoutes.delete("/patrimonio/:id", patrimonioController.deletePat);

export default patrimonioRoutes;