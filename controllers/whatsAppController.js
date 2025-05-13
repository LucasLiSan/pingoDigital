import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const webhookVerification = (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFICADO");
            res.status(200).send(challenge);
        } else { res.sendStatus(403); }
    }
};

export const receiveMessage = async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0])
        {
            const from = body.entry[0].changes[0].value.messages[0].from;
            const msg_body = body.entry[0].changes[0].value.messages[0].text?.body;
            console.log(`Mensagem recebida: ${msg_body}`);
            if (msg_body) {
                // Enviar menu em formato de LISTA
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        type: "interactive",
                        interactive: {
                            type: "list",
                            body: { text: "Olá! 👋 Escolha uma opção abaixo:" },
                            action: {
                                button: "Opções",
                                sections: [
                                    {
                                        title: "Informações Gerais",
                                        rows: [
                                            { id: "horarios", title: "Horários de Entrada/Saída" },
                                            { id: "reunioes", title: "Agendar Reunião" },
                                            { id: "localizar", title: "Saber Sala do Aluno" },
                                        ],
                                    },
                                    {
                                        title: "Documentos",
                                        rows: [
                                            { id: "declaracao", title: "Solicitar Declaração Escolar" },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                });
            }
            res.sendStatus(200);
        } else { res.sendStatus(404); }
    } else { res.sendStatus(404); }

    const message = body.entry[0].changes[0].value.messages[0];

if (message.type === "text") {
// Se for texto normal, manda o menu
// (código que eu já coloquei acima)
} else if (message.type === "interactive" && message.interactive.type === "list_reply") {
const selected_id = message.interactive.list_reply.id;
console.log(`Opção escolhida: ${selected_id}`);

let resposta = "";

switch (selected_id) {
case "horarios":
resposta = "⏰ Horário de entrada: 7h30 / Horário de saída: 17h00.";
break;
case "reunioes":
resposta = "📅 Para agendar uma reunião, envie seu nome e assunto.";
break;
case "localizar":
resposta = "🔍 Informe o nome completo do aluno para localizar a sala.";
break;
case "declaracao":
resposta = "📄 Estamos gerando sua declaração. Por favor, aguarde...";
// Aqui você pode já chamar a função que gera a declaração!
break;
default:
resposta = "Desculpe, não entendi sua escolha.";
}

await axios({
method: "POST",
url: `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
data: {
messaging_product: "whatsapp",
to: message.from,
text: { body: resposta },
},
});

res.sendStatus(200);
}
};
