import Material from "../models/almoxarifado.js"

class MaterialService {
    async createMaterial(data) {
      return await Material.create(data);
    }
  
    async getAllMaterials() {
      return await Material.find();
    }
  
    async getMaterialByCodigo(codigoBarras) {
      return await Material.findOne({ codigoBarras });
    }
  
    async addEntrada(codigoBarras, entrada) {
      const material = await Material.findOne({ codigoBarras });
      if (!material) throw new Error("Material não encontrado");
  
      material.entradas.push(entrada);
      material.quantidadeAtual += entrada.quantidade;
      material.status = "EM ESTOQUE";
      material.atualizadoEm = new Date();
      return await material.save();
    }
  
    async addSaida(codigoBarras, saida) {
      const material = await Material.findOne({ codigoBarras });
      if (!material) throw new Error("Material não encontrado");
  
      if (material.quantidadeAtual < saida.quantidade) {
        throw new Error("Estoque insuficiente");
      }
  
      material.saidas.push(saida);
      material.quantidadeAtual -= saida.quantidade;

      if (material.quantidadeAtual = 0) {
        material.status = "ESGOTADO";
      }

      material.atualizadoEm = new Date();
      return await material.save();
    }
  }
  
  export default new MaterialService();