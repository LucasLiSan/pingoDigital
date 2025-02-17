import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carrega variáveis do .env

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/api-pingoDigital");
        console.log("Conectado com sucesso ao MongoDB.");
    } catch (error) {
        console.error("Erro ao conectar com o MongoDB:", error);
        process.exit(1); // Encerra o processo em caso de falha
    }
};

mongoose.connection.on("error", (err) => {
    console.error("Erro na conexão com o MongoDB:", err);
});

export default connect;
