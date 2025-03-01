import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env (caso esteja rodando localmente)

const connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const connection = mongoose.connection;
connection.on("error", () => console.log("Erro ao conectar com o MongoDB."));
connection.on("open", () => console.log("Conectado com sucesso ao MongoDB."));

connect();

export default mongoose;
