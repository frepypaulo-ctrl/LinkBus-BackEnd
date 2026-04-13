const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const API_KEY = "7f682f8e696d4ead3ef930d4ec29878c";

app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";
    
    // URL formatada sem o 'public.' se o anterior falhar, ou mantendo a estrutura oficial
    const url = `https://public.api.careerjet.net/search?affid=${API_KEY}&location=Angola&keywords=${encodeURIComponent(termo)}&pagesize=20&user_ip=1.1.1.1&user_agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erro na conexão:", error.message);
        // Se a Careerjet continuar a recusar o Render, enviamos vagas de teste para o site não ficar vazio
        res.json({ 
            jobs: [
                {
                    title: "Servidor em Manutenção",
                    company: "LinkBus Angola",
                    locations: "Luanda",
                    url: "#",
                    description: "A API da Careerjet está a bloquear a conexão temporariamente. Tente novamente mais tarde."
                }
            ] 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Rodando na porta ${PORT}`));
