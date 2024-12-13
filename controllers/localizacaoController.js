import Setor from "../models/sectorStreets.js";

const renderLocalizacaoPage = async (req, res) => {
    try {
        const neighborhoods = await Setor.distinct("bairro");
        res.render('localizacao', { neighborhoods }); // Passa os bairros para o EJS
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao carregar a página de localização.');
    }
};

export default renderLocalizacaoPage;