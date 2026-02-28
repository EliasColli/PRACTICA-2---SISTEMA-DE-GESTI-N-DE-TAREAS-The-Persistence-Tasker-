const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, 'tasks.json');


app.use((req, res, next) => {
    console.log(`📡 ${new Date().toLocaleTimeString()} | ${req.method} ${req.url}`);
    next();
});


app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});


app.get('/tasks', (req, res) => {
    try {
        console.log("Procesando GET /tasks");

        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        const tasks = JSON.parse(data);

        console.log(`Se enviaron ${tasks.length} tareas`);

        res.json(tasks);

    } catch (error) {
        console.error("Error al leer tasks.json:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.post('/tasks', (req, res) => {
    try {
        console.log("Procesando POST /tasks");
        console.log("Datos recibidos:", req.body);

        if (!req.body.text || req.body.text.trim() === '') {
            console.log("Texto vacío recibido");
            return res.status(400).json({ error: "El texto de la tarea es obligatorio" });
        }

        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        const tasks = JSON.parse(data);

        const newTask = {
            id: Date.now(),
            text: req.body.text.trim()
        };

        tasks.push(newTask);

        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));

        console.log("Tarea guardada correctamente:", newTask);

        res.status(201).json(newTask);

    } catch (error) {
        console.error("Error al guardar la tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.delete('/tasks/:id', (req, res) => {
    try {
        console.log("Procesando DELETE /tasks/:id");
        console.log("🗑 ID recibido:", req.params.id);

        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        let tasks = JSON.parse(data);

        const originalLength = tasks.length;

        tasks = tasks.filter(task => task.id != req.params.id);

        if (tasks.length === originalLength) {
            console.log("No se encontró tarea con ese ID");
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));

        console.log("Tarea eliminada correctamente");

        res.json({ message: "Tarea eliminada correctamente" });

    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.listen(PORT, () => {
    console.log("=================================");
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log("Persistencia en tasks.json");
    console.log("=================================");
});