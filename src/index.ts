import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { NoteModel } from "./note.schema";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

const allowedOrigins = [
  "https://super-to-do-front.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

// Middleware de CORS antes de las rutas
app.use(cors(corsOptions));

app.get("/note", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Notas obtenidas" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las notas" });
  }
});



// Ruta para crear un usuario
app.post("/note", async (req: Request, res: Response) => {
  // Conectar a MongoDB
connectDB();
  console.log("Servidor para peticioansdads");
  try {
    const { title, desc, priv, deleted } = req.body;
    console.log(title, desc, priv, deleted)
    if (!title || !desc) {
      res.status(400).json({ success: false, message: "Faltan datos necesarios" });
    }
    const user = new NoteModel({ title, desc, priv, deleted });
    await user.save();
    res.status(201).json({ success: true, message: "Usuario creado", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el usuario", data: error });
  }
});

app.get("/note", async (req: Request, res: Response) => {
  // Conectar a MongoDB
connectDB();
  try {
    const notes = await NoteModel.find();

    res.status(200).json({ success: true, message: "Notas obtenidas", data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las notas", data: error });
  }
})

app.put("/note", async (req: Request, res: Response) => {
  // Conectar a MongoDB
connectDB();
  console.log(
    "editing"
  )
  try {
    if (req.body === null) {
      res.status(500).json({ success: false, message: "Error al obtener las notas" });
    } else {
      const data = req.body
      await NoteModel.findByIdAndUpdate(data.id, data)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las notas", data: error });
  }
})

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("estoy aqui en el back", PORT);

});
