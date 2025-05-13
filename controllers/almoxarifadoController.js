import MaterialService from "../services/almoxarifadoService.js";

/* --- Renderizar a página --- */
const renderAlmoxarifadoPage = (req, res) => {
  try {
      res.render("almoxarifado");
  } catch (error) {
      console.log(error);
      res.status(500).json({ err: "Erro ao carregar a página do achados e perdidos." }); // Status 500: Internal Server Error
  }
};

const cadastrarMaterial = async (req, res) => {
  try {
    const novo = await MaterialService.createMaterial(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const listarMateriais = async (req, res) => {
  try {
    const lista = await MaterialService.getAllMaterials();
    res.status(200).json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorCodigo = async (req, res) => {
  try {
    const material = await MaterialService.getMaterialByCodigo(req.params.codigoBarras);
    if (!material) {
      return res.status(404).json({ erro: "Material não encontrado" });
    }
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const registrarEntrada = async (req, res) => {
  try {
    const atualizado = await MaterialService.addEntrada(req.params.codigoBarras, req.body);
    res.status(200).json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const registrarSaida = async (req, res) => {
  try {
    const atualizado = await MaterialService.addSaida(req.params.codigoBarras, req.body);
    res.status(200).json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export default {
  renderAlmoxarifadoPage,
  cadastrarMaterial,
  listarMateriais,
  buscarPorCodigo,
  registrarEntrada,
  registrarSaida
};