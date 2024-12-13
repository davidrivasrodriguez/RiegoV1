import express from 'express';
import cors from 'cors';

// Crear la aplicación de Express
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(cors());
app.use(express.json());

const datos = {
    estados: [],
    configuracion: {
        grupo1: ["riego1", "riego2"],
        grupo2: ["riego1", "riego2", "riego3", "riego4"],
        grupo3: ["riego1", "riego2"],
        grupo4: ["riego1", "riego2", "riego3", "riego4", "riego5"],
    }
}

// Rutas
app.post('/api/estado', (req, res) => {
    const { name, state } = req.body;
    const existingState = datos.estados.find(item => item.name === name);
    if (existingState) {
        existingState.state = state;
    } else {
        datos.estados.push({ name, state });
    }
    console.log(`Estado de ${name} actualizado a ${state}`);
    res.status(200).json({ name, state });
});

app.get('/api/estado', (req, res) => {
    res.json(datos.estados);
});

app.get('/api/configuracion', (req, res) => {
    res.json(datos.configuracion);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});