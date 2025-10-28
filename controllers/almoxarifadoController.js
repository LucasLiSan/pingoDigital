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
export const registrarEntrada = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const { fornecedor, quantidade, data, localizacao } = req.body;

    const material = await materialService.getOneByCodigo(codigoBarras);
    if (!material) {
      return res.status(404).json({ erro: "Material não encontrado." });
    }

    // ======== 🔹 Atualizar ESTOQUES ======== //
    const { armario, prateleira } = localizacao;
    const idx = material.estoques.findIndex(
      (e) =>
        e.armario.toUpperCase() === armario.toUpperCase() &&
        e.prateleira.toUpperCase() === prateleira.toUpperCase()
    );

    if (idx >= 0) {
      // Já existe local → soma a quantidade
      material.estoques[idx].quantidade += quantidade;
      material.estoques[idx].atualizadoEm = new Date();
    } else {
      // Novo local → adiciona entrada
      material.estoques.push({
        armario,
        prateleira,
        quantidade,
        atualizadoEm: new Date(),
      });
    }

    // ======== 🔹 Atualizar QUANTIDADE TOTAL ======== //
    material.quantidadeAtual = material.estoques.reduce(
      (sum, e) => sum + (e.quantidade || 0),
      0
    );

    // ======== 🔹 Atualizar ENTRADAS (histórico) ======== //
    material.entradas.push({
      fornecedor,
      quantidade,
      data,
    });

    // ======== 🔹 Atualizar LOG ======== //
    material.logs.push({
      tipo: "ENTRADA",
      quantidade,
      data,
      fornecedor,
    });

    // Atualiza data de modificação geral
    material.atualizadoEm = new Date();

    await material.save();

    res.json({
      sucesso: true,
      mensagem: "Entrada registrada com sucesso.",
      material,
    });
  } catch (err) {
    console.error("Erro ao registrar entrada:", err);
    res.status(500).json({ erro: "Erro ao registrar entrada." });
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