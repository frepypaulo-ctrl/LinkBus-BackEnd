const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const API_KEY = "7f682f8e696d4ead3ef930d4ec29878c";

app.get('/', (req, res) => {
    res.send('🚀 LinkBus Server Online!');
});

app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";
    
    // Tenta pegar o IP, mas se vier algo estranho, usa um IP padrão de Angola ou fixo
    let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '1.1.1.1';
    
    // Limpeza rápida do IP (caso venha uma lista separada por vírgula)
    if (userIP.includes(',')) {
        userIP = userIP.split(',')[0];
    }

    const url = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=${userIP}&user_agent=Mozilla`;

    try {
        const response = await axios.get(url, { timeout: 10000 }); // 10 segundos de limite
        res.json(response.data);
    } catch (error) {
        console.error("Erro na Careerjet:", error.message);
        
        // Se falhou com o IP do usuário, tentamos UMA última vez com um IP fixo
        try {
            const retryUrl = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=1.1.1.1&user_agent=Mozilla`;
            const retryRes = await axios.get(retryUrl);
            res.json(retryRes.data);
        } catch (finalError) {
            res.status(500).json({ error: "Erro ao buscar vagas", details: finalError.message });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor na porta ${PORT}`);
});
