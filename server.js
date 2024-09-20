const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Ambil data pengguna dari data.json
app.get('/users', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }
        res.send(JSON.parse(data));
    });
});

// Tambah pengguna baru ke data.json
app.post('/users', (req, res) => {
    const newUser = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to data file');
                return;
            }
            res.send(newUser);
        });
    });
});

// Tambah catatan baru untuk pengguna tertentu
app.post('/users/:nik/notes', (req, res) => {
    const nik = req.params.nik;
    const newNote = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.nik === nik);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        user.notes.push(newNote);

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to data file');
                return;
            }
            res.send(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

