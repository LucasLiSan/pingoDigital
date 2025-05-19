/* ----------  IMPORTAÇÃO DE MÓDULOS ---------- */
import express from "express";
import ip from "ip";
//import mongoose from "mongoose";
import multer from "multer";

/* ----------  BANCO DE DADOS ---------- */
import mongoose from "./config/dbConfig.js";
//mongoose.connect("mongodb://127.0.0.1:27017/api-pingoDigital");

/* ----------  IMPORTAÇÃO DE MODELS ---------- */
import Student from "./models/students.js";

/* ----------  IMPORTAÇÃO DE ROTAS ---------- */
import achadosRoutes from "./routes/achadosRoutes.js";
import almoxarifadoRoutes from "./routes/almoxarifadoRoutes.js";
import almoxarifadoPedidosRoutes from "./routes/almoxarifadoPedidosRoutes.js";
import aulaRoutes from "./routes/horaEducFisicRoutes.js"
import calendarioRoutes from "./routes/calendarioRoutes.js";
import cardapioRoutes from "./routes/cardapioRoutes.js";
import docentesRoutes from './routes/docentesRoute.js';
import homeRoutes from './routes/homeRoute.js';
import horaRoutes from "./routes/horaTrabFuncRoute.js";
import localizacaoRoutes from "./routes/localizacaoRoute.js";
import loginRoutes from "./routes/loginRoutes.js";
import patrimonioRoutes from "./routes/patrimonioRoutes.js";
import sectorRoutes from "./routes/sectorStreetsRoutes.js";
import sobreRoutes from "./routes/sobreRoute.js";
import studentRoutes from "./routes/studentsRoutes.js";
import transparenciaRoutes from "./routes/transparenciaRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";

import { render } from "ejs";

/* ----------  INICIANDO O EXPRESS ---------- */
const app = express();

/* ----------  DEFINIÇÕES BÁSICAS ---------- */
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', almoxarifadoRoutes);
app.use("/", almoxarifadoPedidosRoutes);
app.use('/', achadosRoutes);
app.use('/', aulaRoutes);
app.use('/', calendarioRoutes);
app.use('/', cardapioRoutes);
app.use('/', docentesRoutes);
app.use('/', homeRoutes);
app.use('/', horaRoutes);
app.use('/', localizacaoRoutes);
app.use('/', loginRoutes);
app.use('/', patrimonioRoutes);
app.use('/', sectorRoutes);
app.use('/', sobreRoutes);
app.use('/', studentRoutes);
app.use('/', transparenciaRoutes);
app.use('/', whatsappRoutes);

/* ----------\/ INICIANDO SERVIDOR \/---------- */
const port = 8080;
const myServer = ip.address();
const renderPort = '0.0.0.0';
console.log(myServer);

app.listen(port, renderPort, (error) => {
    if(error) {console.log(error); }
    console.log(`API rodando em http://localhost:${port}.`);
});