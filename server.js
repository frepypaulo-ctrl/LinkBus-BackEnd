const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// IMPORTANTE: Configuração de CORS para o Render
// Quando você hospedar o frontend, substitua '*' pela URL do seu site (ex: https://linkbus.vercel.app)
app.use(cors());

const API_KEY = "7f682f8e696d4ead3ef930d4ec29878c";

app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";

    // O Render precisa que a URL da API externa seja completa
    const url = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=1.1.1.1&user_agent=Mozilla`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Erro na API Careerjet:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados da Careerjet" });
    }
});

// CRUCIAL PARA O RENDER: O Render define a porta automaticamente na variável process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando com sucesso na porta ${PORT}`);
});