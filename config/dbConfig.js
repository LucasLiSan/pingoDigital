import mongoose from "mongoose";

const connect = () => { mongoose.connect(`mongodb+srv://lukassantanargtsp:admin@cluster0.qb7z0.mongodb.net/api-pingoDigital?retryWrites=true&w=majority&appName=Cluster0`); }

const connection = mongoose.connection;
connection.on("error", () => { console.log("Erro ao conectar com o MongoDB.")});
connection.on("open", () => { console.log("Conectado com sucesso ao MongoDB.")});

connect();

export default mongoose;