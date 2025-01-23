import mongoose from "mongoose";

const desjejumSchema = new mongoose.Schema(
    { itens: [{ type: String }] },
    { _id: false }
);

const almocoDiaSchema = new mongoose.Schema(
    { itens: [{ type: String }] },
    { _id: false }
);

const almocoSchema = new mongoose.Schema(
    {
        prato_do_dia: { type: String, required: true },
        almoco_do_dia: [almocoDiaSchema]
    },
    { _id: false }
);

const sobremesaSchema = new mongoose.Schema(
    { itens: [{ type: String }] },
    { _id: false }
);

const diaSchema = new mongoose.Schema(
    {
        dia: { type: Number, required: true },
        desjejum: [desjejumSchema],
        almoco: [almocoSchema],
        sobremesa: [sobremesaSchema]
    },
    { _id: false }
);

const cardapioSchema = new mongoose.Schema({
    mes: { type: String, required: true },
    ano: { type: Number, required: true },
    dias: [diaSchema]
});

const cardapioRegularSchema = new mongoose.Schema({
    cardapio_regular: [cardapioSchema]
});

const CardapioEscolarRegular = mongoose.model('CardapioEscolarRegular', cardapioRegularSchema);

export default CardapioEscolarRegular;