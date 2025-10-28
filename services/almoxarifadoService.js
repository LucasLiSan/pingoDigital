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

            // ✅ REGISTRA ENTRADA
            material.entradas.push(entrada);

            // ✅ ATUALIZA LOCALIZAÇÃO E ESTOQUES
            const { armario, prateleira } = entrada.localizacao || {};
            if (armario && prateleira) {
                const existente = material.estoques.find(
                    e => e.armario === armario && e.prateleira === prateleira
                );

                if (existente) {
                    existente.quantidade += entrada.quantidade;
                    existente.atualizadoEm = new Date();
                } else {
                    material.estoques.push({
                        armario,
                        prateleira,
                        quantidade: entrada.quantidade,
                        atualizadoEm: new Date()
                    });
                }
            }

            // ✅ RECALCULA TOTAL GERAL
            material.quantidadeAtual = material.estoques.reduce(
                (soma, e) => soma + e.quantidade,
                0
            );

            // ✅ ADICIONA LOG
            material.logs.push({
                tipo: "ENTRADA",
                quantidade: entrada.quantidade,
                data: entrada.data || new Date(),
                fornecedor: entrada.fornecedor
            });

            // ✅ ATUALIZA STATUS
            material.status = material.quantidadeAtual > 0 ? "EM ESTOQUE" : "ESGOTADO";
            material.atualizadoEm = new Date();

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
            const material = await Material.findOne({ codigoBarras });
            if (!material) {
                console.log(`Material com código ${codigoBarras} não encontrado.`);
                return null;
            }

            // ======== 🔹 Atualizar campos básicos ======== //
            material.nome = dadosAtualizados.nome || material.nome;
            material.descricao = dadosAtualizados.descricao || material.descricao;
            material.marca = dadosAtualizados.marca || material.marca;
            material.validade = dadosAtualizados.validade || material.validade;
            material.cor = dadosAtualizados.cor?.length ? dadosAtualizados.cor : material.cor;
            material.medidas = {
                largura_cm: dadosAtualizados.medidas?.largura_cm ?? material.medidas?.largura_cm,
                comprimento_cm: dadosAtualizados.medidas?.comprimento_cm ?? material.medidas?.comprimento_cm,
                altura_cm: dadosAtualizados.medidas?.altura_cm ?? material.medidas?.altura_cm,
            };
            material.peso_gramas = dadosAtualizados.peso_gramas ?? material.peso_gramas;
            material.tamanho_numerico = dadosAtualizados.tamanho_numerico ?? material.tamanho_numerico;
            material.volume_ml = dadosAtualizados.volume_ml ?? material.volume_ml;
            material.categoria = dadosAtualizados.categoria || material.categoria;

            // ======== 🔹 Atualizar/Adicionar Estoques ======== //
            if (dadosAtualizados.localizacao && dadosAtualizados.quantidadeAtual > 0) {
                const { armario, prateleira } = dadosAtualizados.localizacao;
                const qtd = dadosAtualizados.quantidadeAtual;

                const idx = material.estoques.findIndex(
                    (e) =>
                    e.armario.toUpperCase() === armario.toUpperCase() &&
                    e.prateleira.toUpperCase() === prateleira.toUpperCase()
                );

                if (idx >= 0) {
                    // Já existe → atualiza quantidade e data
                    material.estoques[idx].quantidade = qtd;
                    material.estoques[idx].atualizadoEm = new Date();
                } else {
                    // Novo local → adiciona
                    material.estoques.push({
                        armario,
                        prateleira,
                        quantidade: qtd,
                        atualizadoEm: new Date(),
                    });
                }

                // Atualiza total
                material.quantidadeAtual = material.estoques.reduce((sum, e) => sum + (e.quantidade || 0), 0 );
            }

            // ======== 🔹 Atualizar status e data ======== //
            material.status = material.quantidadeAtual > 0 ? "EM ESTOQUE" : "ESGOTADO";
            material.atualizadoEm = new Date();

            await material.save();
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