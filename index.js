import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Crear la aplicación de Express
const app = express();
const PORT = 3000;

// Crear el servidor HTTP y el servidor de WebSockets
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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
        grupo5: ["riego1", "riego2"],
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
    io.emit('estadoActualizado', { name, state }); 
    res.status(200).json({ name, state });
});

app.get('/api/estado', (req, res) => {
    res.json(datos.estados);
});

app.get('/api/configuracion', (req, res) => {
    res.json(datos.configuracion);
});

io.on('connection', (socket) => {
    // enviamos los estados al cliente
    socket.on('estadoActualizado', ({ name, state }) => {
        // buscar si ya existe el estado, en caso de existir se actualiza, si no, se añade al array de estados
        const existingState = datos.estados.find(item => item.name === name);
        if (existingState) {
            existingState.state = state;
        } else {
            datos.estados.push({ name, state });
        }
        console.log(`Estado de ${name} actualizado a ${state}`);
        // enviamos el estado actualizado a todos los clientes a tiempo real
        io.emit('estadoActualizado', { name, state }); 
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});