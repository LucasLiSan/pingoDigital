import mongoose from "mongoose";

const desjejumSchema = new mongoose.Schema ({
    itens: [{type: String}]
});

const almocoDiaSchema = new mongoose.Schema ({
    itens: [{type: String}]
});

const almocoSchema = new mongoose.Schema ({
    prato_do_dia: {type: String, require: true},
    almoco_do_dia: [almocoDiaSchema]
});

const sobremesaSchema = new mongoose.Schema ({
    itens: [{type: String}]
});

const diaSchema = new mongoose.Schema ({
    dia: {type: Number, require: true},
    desjejum: [desjejumSchema],
    almoco: [almocoSchema],
    sobremesa: [sobremesaSchema]
});

const cardapioSchema = new mongoose.Schema ({
    mes: { type: String, require: true},
    ano: { type: Number, require: true},
    dias: [diaSchema]
});

const cardapioRegularSchema = new mongoose.Schema ({
    cardapio_regular: [cardapioSchema]
});

const CardapioEscolarRegular = new mongoose.model ('CardapioEscolarRegular', cardapioRegularSchema);

export default CardapioEscolarRegular;