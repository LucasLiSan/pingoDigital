import express from "express";
import sectorStreetsController from "../controllers/sectorStreetsController.js";

const sectorRoutes = express.Router();

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo setor */
sectorRoutes.post("/setor", sectorStreetsController.createNewSectorStreet);

/* 2º Endpoint: Listar todos os setor */
sectorRoutes.get("/setores", sectorStreetsController.getAllSectors);

/* 3º Endpoint: Listar um setor */
sectorRoutes.get("/setor/:id", sectorStreetsController.getOneSector);

/* 4º Endpoint: Atualizar um setor */
sectorRoutes.put("/setor/:id", sectorStreetsController.updateSector);

/* 5º Endpoint: Deletar um setor */
sectorRoutes.delete("/setor/:id", sectorStreetsController.deleteSector);

export default sectorRoutes;