const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = './tasks.json';

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente ;3');
});

app.get('/tasks', (req, res) => {
    const data = fs.readFileSync(FILE_PATH);
    res.json(JSON.parse(data));
});

app.post('/tasks', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync(FILE_PATH));

    const newTask = {
        id: Date.now(),
        text: req.body.text
    };

    tasks.push(newTask);

    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));

    res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    let tasks = JSON.parse(fs.readFileSync(FILE_PATH));

    tasks = tasks.filter(task => task.id != req.params.id);

    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));

    res.json({ message: 'Tarea eliminada' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});