const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => { 
    res.json(
        { 
            status: 'ok',
            timestamp: new Date().toISOString(),
            By : 'rafael'
        }
    );
});

app.post('/imc', (req, res) => {
    const { peso, altura } = req.body;

    if (typeof peso !== 'number' || typeof altura !== 'number') {
        return res.status(400).json({ error: 'Peso e altura devem ser números.' });
    }

    if (altura <= 0) {
        return res.status(400).json({ error: 'Altura deve ser maior que zero.' });
    }

    if (peso <= 0) {
        return res.status(400).json({ error: 'Peso deve ser maior que zero.' });
    }

    const imc = peso / (altura * altura);
    let classificacao = '';

    if (imc < 18.5) {
        classificacao = 'Abaixo do peso';
    }
    else if (imc >= 18.5 && imc < 25) {
        classificacao = 'Peso normal';
    }
    else if (imc >= 25 && imc < 30) {
        classificacao = 'Sobrepeso';
    }
    else {
        classificacao = 'Obesidade';
    }

    res.json({ imc, classificacao });
});

module.exports = app;