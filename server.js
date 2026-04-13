const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// --- SUAS CREDENCIAIS REAIS ADZUNA ---
const ADZUNA_ID = "45a5b9ba"; 
const ADZUNA_KEY = "3fa642bfa053b6df8ee3e662a643b11e";

app.get('/', (req, res) => {
    res.send('🚀 LinkBus Backend com Adzuna Online!');
});

app.get('/api/vagas', async (req, res) => {
    const termo = req.query.keywords || "";
    
    // API da Adzuna focada em Angola (country code: ao)
    const url = `https://api.adzuna.com/v1/api/jobs/ao/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&what=${encodeURIComponent(termo)}&results_per_page=20&content-type=application/json`;

    try {
        const response = await axios.get(url);
        
        // Mapeando os dados da Adzuna para o formato que o seu index.js já entende
        const vagasFormatadas = response.data.results.map(v => ({
            title: v.title.replace(/<\/?[^>]+(>|$)/g, ""), // Limpa tags HTML do título
            company: v.company.display_name || "Empresa Confidencial",
            locations: v.location.display_name,
            salary: v.salary_min ? `Kz ${v.salary_min.toLocaleString()}` : "Salário a combinar",
            description: v.description.replace(/<\/?[^>]+(>|$)/g, ""), // Limpa tags HTML
            url: v.redirect_url,
            date: new Date(v.created).toLocaleDateString('pt-PT')
        }));

        res.json({ jobs: vagasFormatadas });
    } catch (error) {
        console.error("Erro na Adzuna:", error.message);
        // Retorna lista vazia em caso de erro para não travar o site
        res.json({ jobs: [] });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor LinkBus rodando na porta ${PORT}`);
});
