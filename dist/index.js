"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const note_schema_1 = require("./note.schema");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware para parsear JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
// Conectar a MongoDB
(0, db_1.connectDB)();
// Ruta básica
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente.");
});
// Ruta para crear un usuario
app.post("/note", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Servidor para peticioansdads");
    try {
        const { title, desc, priv, deleted } = req.body;
        console.log(title, desc, priv, deleted);
        if (!title || !desc) {
            res.status(400).json({ success: false, message: "Faltan datos necesarios" });
        }
        const user = new note_schema_1.NoteModel({ title, desc, priv, deleted });
        yield user.save();
        res.status(201).json({ success: true, message: "Usuario creado", data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error al crear el usuario", data: error });
    }
}));
app.get("/note", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield note_schema_1.NoteModel.find();
        res.status(200).json({ success: true, message: "Notas obtenidas", data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener las notas", data: error });
    }
}));
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
