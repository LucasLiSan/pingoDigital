import materialService from "../services/almoxarifadoService.js";
import { ObjectId } from "mongodb";

/* --- Renderizar a página principal do estoque --- */
const renderAlmoxarifadoPage = (req, res) => {
    try { res.render("almoxarifado"); } // View EJS
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao carregar a página do estoque." });
    }
};

/* --- Cadastrar novo material --- */
const createNewMaterial = async (req, res) => {
    try {
        const data = req.body;
        const novoMaterial = await materialService.create(data);
        res.status(201).json({ success: `Material '${novoMaterial.nome}' cadastrado com sucesso.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar material." });
    }
};

/* --- Listar todos os materiais --- */
const getAllMaterials = async (req, res) => {
    try {
        const materiais = await materialService.getAll();
        res.status(200).json({ materiais });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar materiais." });
    }
};

/* --- Buscar material por código de barras --- */
const getMaterialByCodigo = async (req, res) => {
    try {
        const { codigoBarras } = req.params;
        const material = await materialService.getOneByCodigo(codigoBarras);

        if (!material) { return res.status(404).json({ error: "Material não encontrado." }); }

        res.status(200).json({ material });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar material." });
    }
};

/* --- Registrar entrada de material --- */
const registrarEntrada = async (req, res) => {
    try {
        const { codigoBarras } = req.params;
        const entrada = req.body;

        const materialAtualizado = await materialService.addEntrada(codigoBarras, entrada);
        res.status(200).json({ success: "Entrada registrada com sucesso.", materialAtualizado });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

/* --- Registrar saída de material --- */
const registrarSaida = async (req, res) => {
    try {
        const { codigoBarras } = req.params;
        const saida = req.body;

        const materialAtualizado = await materialService.addSaida(codigoBarras, saida);
        res.status(200).json({ success: "Saída registrada com sucesso.", materialAtualizado });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

/* --- Atualizar material por código de barras --- */
const updateMaterial = async (req, res) => {
    try {
        const { codigoBarras } = req.params;
        const dados = req.body;

        const materialAtualizado = await materialService.update(codigoBarras, dados);
        
        if (!materialAtualizado) { return res.status(404).json({ error: "Material não encontrado para atualizar." }); }
        
        res.status(200).json({ success: "Material atualizado com sucesso.", materialAtualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar material." });
    }
};

/* --- Deletar material por código de barras --- */
const deleteMaterial = async (req, res) => {
    try {
        const { codigoBarras } = req.params;
        const material = await materialService.getOneByCodigo(codigoBarras);
        
        if (!material) { return res.status(404).json({ error: "Material não encontrado." }); }

        await materialService.delete(codigoBarras);
        
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar material." });
    }
};

export default {
    renderAlmoxarifadoPage,
    createNewMaterial,
    getAllMaterials,
    getMaterialByCodigo,
    registrarEntrada,
    registrarSaida,
    updateMaterial,
    deleteMaterial
};