import express from "express";
import sectorStreetsController from "../controllers/sectorStreetsController.js";

const sectorRoutes = express.Router();

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo setor */
sectorRoutes.post("/setor", sectorStreetsController.createNewSectorStreet);

/* 2º Endpoint: Listar todos os setor */
sectorRoutes.get("/setores", sectorStreetsController.getAllSectors);

/* 3º Endpoint: Listar bairros únicos */
sectorRoutes.get("/setor", sectorStreetsController.getUniqueNeighborhoods);

/* 4º Endpoint: Buscar ruas por setor e bairro */
sectorRoutes.get("/ruas", sectorStreetsController.getStreetsBySectorAndNeighborhood);

sectorRoutes.get("/nomeruas", sectorStreetsController.searchStreetsBySector);

/* 5º Endpoint: Listar um setor */
sectorRoutes.get("/setor/:id", sectorStreetsController.getOneSector);

/* 6º Endpoint: Atualizar um setor */
sectorRoutes.put("/setor/:id", sectorStreetsController.updateSector);

/* 7º Endpoint: Deletar um setor */
sectorRoutes.delete("/setor/:id", sectorStreetsController.deleteSector);

export default sectorRoutes;