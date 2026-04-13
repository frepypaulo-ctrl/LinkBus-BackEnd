const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const API_KEY = "7f682f8e696d4ead3ef930d4ec29878c";

app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";
    
    // Voltamos para a Careerjet, mas com uma configuração de headers mais robusta
    const url = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=1.1.1.1&user_agent=Mozilla/5.0`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erro na busca:", error.message);
        
        // Se a Careerjet continuar a bloquear o Render, vamos usar um plano B:
        // Buscar vagas de Angola através de um agregador aberto (se disponível) ou avisar o user
        res.json({ jobs: [] });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor na porta ${PORT}`));
