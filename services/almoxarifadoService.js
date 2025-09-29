import Material from "../models/almoxarifado.js";
import gerarCodigoBarras from "../utils/geradorCodigo.js";


class MaterialService {
    // Cadastrar novo material
    async create(data) {
        try {
            if (!data.codigoBarras || data.codigoBarras.trim() === "") {
                data.codigoBarras = gerarCodigoBarras();
            }

            // 🚨 Garante entrada inicial obrigatória
            if (!data.entradas || !data.entradas.length) {
                throw new Error("É obrigatório informar fornecedor e quantidade inicial.");
            }

            const entradaInicial = data.entradas[0];

            data.quantidadeAtual = entradaInicial.quantidade;
            data.status = entradaInicial.quantidade > 0 ? "EM ESTOQUE" : "ESGOTADO";
            data.atualizadoEm = new Date();

            const material = new Material(data);
            await material.save();
            return material;
        } catch (error) {
            console.error("Erro ao cadastrar material:", error);
            throw error;
        }
    }

    // Listar todos os materiais
    async getAll() {
        try { return await Material.find();}
        catch (error) { console.error("Erro ao buscar materiais:", error); }
    }

    // Buscar um material pelo código de barras
    async getOneByCodigo(codigoBarras) {
        try { return await Material.findOne({ codigoBarras }); }
        catch (error) { console.error("Erro ao buscar material:", error); }
    }

    // Adicionar uma entrada
    async addEntrada(codigoBarras, entrada) {
        try {
            const material = await Material.findOne({ codigoBarras });
            if (!material) throw new Error("Material não encontrado");

            material.entradas.push(entrada);
            material.quantidadeAtual += entrada.quantidade;
            material.atualizadoEm = new Date();

            // Adiciona log
            material.logs.push({
                tipo: "ENTRADA",
                quantidade: entrada.quantidade,
                data: entrada.data || new Date(),
                fornecedor: entrada.fornecedor
            });

            material.status = material.quantidadeAtual > 0 ? "EM ESTOQUE" : "ESGOTADO";

            await material.save();
            return material;
        } catch (error) {
            console.error("Erro ao registrar entrada:", error);
            throw error;
        }
    }

    // Adicionar uma saída
    async addSaida(codigoBarras, saida) {
        try {
            const material = await Material.findOne({ codigoBarras });
            if (!material) throw new Error("Material não encontrado");

            if (material.quantidadeAtual < saida.quantidade) throw new Error("Estoque insuficiente");

            material.saidas.push(saida);
            material.quantidadeAtual -= saida.quantidade;
            material.atualizadoEm = new Date();

            // Adiciona log
            material.logs.push({
                tipo: "SAÍDA",
                quantidade: saida.quantidade,
                data: saida.data || new Date(),
                motivo: saida.motivo,
                destino: saida.destino,
                origem: saida.origem
            });

            material.status = material.quantidadeAtual > 0 ? "EM ESTOQUE" : "ESGOTADO";

            await material.save();
            return material;
        } catch (error) {
            console.error("Erro ao registrar saída:", error);
            throw error;
        }
    }

    // Atualizar um material
    async update(codigoBarras, dadosAtualizados) {
        try {
            const material = await Material.findOneAndUpdate({ codigoBarras }, dadosAtualizados, { new: true });
            if (!material) {
                console.log(`Material com código ${codigoBarras} não encontrado.`);
                return null;
            }
            return material;
        } catch (error) {
            console.error("Erro ao atualizar material:", error);
            throw error;
        }
    }

    // Deletar um material
    async delete(codigoBarras) {
        try {
            await Material.findOneAndDelete({ codigoBarras });
            console.log(`Material com código ${codigoBarras} foi deletado.`);
        } catch (error) { console.error("Erro ao deletar material:", error); }
    }
}

export default new MaterialService();