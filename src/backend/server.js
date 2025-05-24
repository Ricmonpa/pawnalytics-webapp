// backend/server.js

require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai'); // Importa la clase OpenAI

const app = express();
const port = process.env.PORT || 5000; // El puerto donde se ejecutará tu backend

// Configurar CORS para permitir solicitudes desde tu frontend React
app.use(cors({
    origin: 'http://localhost:3000' // O la URL de tu frontend en Codespaces
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Inicializa el cliente de OpenAI con tu clave de API
// ¡Importante! Asegúrate de que OPENAI_API_KEY esté en tu archivo .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando correctamente.');
});

// --- RUTA PARA HABLAR CON CHATGPT ---
app.post('/chat', async (req, res) => {
    const { messages } = req.body; // El frontend enviará un array de mensajes

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Puedes cambiar a "gpt-4" si tienes acceso
            messages: messages,
            // Puedes añadir más parámetros aquí si los necesitas, como temperature, max_tokens, etc.
        });

        // La respuesta de ChatGPT estará en completion.choices[0].message.content
        res.json({ reply: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error al comunicarse con OpenAI:', error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud con ChatGPT.' });
    }
});

// --- RUTA PARA HABLAR CON ROBOTFLOW (Placeholder por ahora) ---
app.post('/detect-image', async (req, res) => {
    const { imageData } = req.body; // El frontend enviará los datos de la imagen

    try {
        // Aquí iría la lógica para enviar imageData a la API de Roboflow
        // y procesar la respuesta.
        // Por ahora, solo es un placeholder:
        console.log("Recibida solicitud para detectar imagen:", imageData ? "Imagen presente" : "No hay imagen");
        const mockDetectionResults = {
            detections: [
                { class: 'obesity', confidence: 0.85, box: { x: 10, y: 20, width: 50, height: 60 } },
                { class: 'cataracts', confidence: 0.92, box: { x: 70, y: 80, width: 30, height: 40 } }
            ],
            message: "Resultados simulados de detección de Roboflow."
        };
        res.json(mockDetectionResults);

    } catch (error) {
        console.error('Error al comunicarse con Roboflow:', error);
        res.status(500).json({ error: 'Hubo un error al procesar la imagen con Roboflow.' });
    }
});


// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
    console.log(`Recuerda abrir este puerto en Codespaces si no lo está automáticamente.`);
});