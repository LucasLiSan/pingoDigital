/* ----------  IMPORTAÇÃO DE MÓDULOS ---------- */
import express from "express";
import ip from "ip";
import mongoose from "mongoose";
import multer from "multer";

/* ----------  BANCO DE DADOS ---------- */
//import mongoose from "./config/dbConnection.js";
mongoose.connect("mongodb://127.0.0.1:27017/api-pingoDigital");

/* ----------  IMPORTAÇÃO DE MODELS ---------- */
import Student from "./models/students.js";

/* ----------  IMPORTAÇÃO DE ROTAS ---------- */
import studentRoutes from "./routes/studentsRoutes.js";
import homeRoutes from './routes/homeRoute.js';
import docentesRoutes from './routes/docentesRoute.js';
import sobreRoutes from "./routes/sobreRoute.js";
import localizacaoRoutes from "./routes/localizacaoRoute.js";
import calendarioRoutes from "./routes/calendarioRoutes.js";
import cardapioRoutes from "./routes/cardapioRoutes.js";
import transparenciaRoutes from "./routes/transparenciaRoutes.js";
import sectorRoutes from "./routes/sectorStreetsRoutes.js"

/* ----------  INICIANDO O EXPRESS ---------- */
const app = express();

/* ----------  DEFINIÇÕES BÁSICAS ---------- */
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', studentRoutes);
app.use('/', homeRoutes);
app.use('/', docentesRoutes);
app.use('/', sobreRoutes);
app.use('/', localizacaoRoutes);
app.use('/', calendarioRoutes);
app.use('/', cardapioRoutes);
app.use('/', transparenciaRoutes);
app.use('/', sectorRoutes);

/* ----------\/ INICIANDO SERVIDOR \/---------- */
const port = 8080;
const myServer = ip.address();
const renderPort = '0.0.0.0';
console.log(myServer);

app.listen(port, (error) => {
    if(error) {console.log(error); }
    console.log(`API rodando em http://localhost:${port}.`);
});