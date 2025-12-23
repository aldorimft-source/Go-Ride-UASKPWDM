const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    console.log('Terhubung ke database SQLite.');
});

// Inisialisasi Tabel
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nama TEXT, email TEXT UNIQUE, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS alamat (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, detail TEXT)`);
});

// --- AUTH API ---
app.post('/register', (req, res) => {
    const { nama, email, password } = req.body;
    db.run(`INSERT INTO users (nama, email, password) VALUES (?, ?, ?)`, [nama, email, password], (err) => {
        if (err) return res.status(400).json({ error: "Email sudah ada!" });
        res.json({ message: "Registrasi Berhasil" });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (row) res.json({ message: "Login Berhasil", user: row });
        else res.status(400).json({ error: "Email atau Password salah!" });
    });
});

// --- CRUD ALAMAT API ---
app.get('/alamat', (req, res) => {
    db.all("SELECT * FROM alamat", [], (err, rows) => res.json(rows));
});

app.post('/alamat', (req, res) => {
    const { label, detail } = req.body;
    db.run("INSERT INTO alamat (label, detail) VALUES (?, ?)", [label, detail], function(err) {
        res.json({ id: this.lastID, label, detail });
    });
});

app.put('/alamat/:id', (req, res) => {
    const { label, detail } = req.body;
    db.run("UPDATE alamat SET label = ?, detail = ? WHERE id = ?", [label, detail, req.params.id], () => {
        res.json({ message: "Update berhasil" });
    });
});

app.delete('/alamat/:id', (req, res) => {
    db.run("DELETE FROM alamat WHERE id = ?", [req.params.id], () => res.json({ message: "Hapus sukses" }));
});

app.listen(3000, () => console.log('Server Backend jalan di port 3000'));