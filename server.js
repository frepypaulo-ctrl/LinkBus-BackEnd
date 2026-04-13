const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Libera o acesso para o seu site frontend
app.use(cors());

const API_KEY = "7f682f8e696d4ead3ef930d4ec29878c";

// --- NOVA ROTA DE TESTE (RAIZ) ---
// Quando você abrir https://linkbus-backend.onrender.com deve aparecer esta mensagem
app.get('/', (req, res) => {
    res.send('🚀 Servidor LinkBus Backend está online e operante!');
});

// --- ROTA DE VAGAS ---
app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";
    
    // Captura o IP real do usuário ou usa um padrão (obrigatório para Careerjet)
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '1.1.1.1';
    
    // URL da API Careerjet
    const url = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=${userIP}&user_agent=Mozilla`;

    console.log(`🔍 Buscando vagas para: "${termo}" | IP: ${userIP}`);

    try {
        const response = await axios.get(url);
        
        // Verifica se a resposta da Careerjet é válida
        if (response.data) {
            console.log(`✅ Vagas encontradas: ${response.data.jobs ? response.data.jobs.length : 0}`);
            res.json(response.data);
        } else {
            res.status(404).json({ error: "Nenhum dado recebido da API" });
        }
    } catch (error) {
        console.error("❌ Erro na Careerjet:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "Erro na conexão com a Careerjet",
            details: error.message 
        });
    }
});

// Porta dinâmica para o Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`✅ LinkBus Server rodando na porta ${PORT}`);
    console.log(`-----------------------------------------`);
});
