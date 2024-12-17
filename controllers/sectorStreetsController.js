import Setor from "../models/sectorStreets.js";
import sectorService from "../services/sectorStreetsService.js";
import { ObjectId } from "mongodb";

const createNewSectorStreet = async (req, res) => {
    try {
        const { rua, nomeAnterior, bairro, numero, setor, historico: [{ evento, detalhes }] } = req.body;

        const newSector = await sectorService.create(rua, nomeAnterior, bairro, numero, setor, evento, detalhes);

        res.status(201).json({
            Success: `Endereço '${newSector.rua}', '${newSector.bairro}' cadastrado com sucesso.`,
            newSector
        }); // Cód. Status 201: Created
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); // Cód. Status 500: Internal Server Error
    }
};

/* --- Listar todos os setores --- */
const getAllSectors = async (req, res) => {
    try {
        const sectors = await sectorService.getAll();
        res.status(200).json({ sectors: sectors }); //Cód. Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Erro interno do servidor.'}); //Cód. Status 500: Internal Server Error
    }
}

/* --- Listar todos os bairros de forma unica --- */
const getUniqueNeighborhoods = async (req, res) => {
    try {
        const neighborhoods = await Setor.distinct("bairro");
        res.status(200).json({ neighborhoods }); // Cód. Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); // Cód. Status 500: Internal Server Error
    }
};

/* --- Buscar bairros e ruas filtrados pelo setor e opcionalmente por bairro --- */
const getStreetsBySectorAndNeighborhood = async (req, res) => {
    try {
        const { setor, bairro } = req.query;

        // Verificar se "setor" está presente
        if (!setor) {
            return res.status(400).json({ error: "O campo 'setor' é obrigatório." });
        }

        // Montar o filtro dinâmico
        const filter = { setor };
        if (bairro) {
            filter.bairro = bairro;
        }

        const streets = await Setor.find(filter, { bairro: 1, rua: 1, _id: 0 });

        // Retornar as ruas encontradas
        res.status(200).json({ streets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Buscar ruas filtradas por setor e rua/nomeAnterior --- */

const searchStreetsBySector = async (req, res) => {
    try {
        const { query, setor } = req.query;

        if (!query || query.length < 3) {
            return res.status(400).json({ error: "A busca deve conter ao menos 3 caracteres." });
        }

        const streets = await Setor.find({
            setor: setor, // Filtra pelo setor
            $or: [
                { rua: { $regex: query, $options: "i" } }, // Busca na rua (case-insensitive)
                { nomeAnterior: { $regex: query, $options: "i" } } // Busca no nomeAnterior
            ]
        }, { rua: 1, nomeAnterior: 1, bairro: 1, _id: 0 });

        res.status(200).json({ streets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Listar um setor --- */
const getOneSector = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const sector = await sectorService.getOne(id);
            if(!sector) { res.status(404).json({ Success: 'Setor não encontrado.' }) } //Cód. Status 404: Not Found
            else { res.status(200).json({ sector })} //Cód. Status 200: OK
        } else { res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Atualizar informações do setores --- */
const updateSector = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { rua, nomeAnterior, bairro, numero, setor, evento, detalhes } = req.body;

            const existingSector = await sectorService.getOne(id);
            if (!existingSector) { 
                return res.status(404).json({ err: 'Rua não encontrada.' }); 
            }

            const updatedSector = await sectorService.update(
                id, rua, nomeAnterior, bairro, numero, setor, evento, detalhes
            );

            res.status(200).json({ 
                Success: `Endereço '${existingSector.rua}', '${existingSector.bairro}' atualizado com sucesso.`,
                updatedSector 
            });
        } else {
            res.sendStatus(400); // Código 400: Bad Request
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); // Código 500: Internal Server Error
    }
};

/* --- Deletar setor --- */
const deleteSector = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const existingSector = await sectorService.getOne(id);
            if (!existingSector) { return res.status(404).json({ err: 'Setor não encontrado.' }); }
            sectorService.delete(id);
            res.status(204).json({ Success: `Endereço '${sectorService.rua}' deletado com sucesso.` }); //Cód. Status 204: No content
        } else {res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

export default { 
    createNewSectorStreet,
    getAllSectors,
    getOneSector, 
    getUniqueNeighborhoods,
    getStreetsBySectorAndNeighborhood,
    updateSector,
    deleteSector,
    searchStreetsBySector
};