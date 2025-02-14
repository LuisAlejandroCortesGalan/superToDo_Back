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


app.use(cors({
  origin: '*', // Permite cualquier origen, útil para pruebas
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Si utilizas cookies o autenticación
}));



app.use((req, res, next) => {
  console.log(req.headers.origin);  // Verifica el origen de la solicitud
  next();
});


app.get("/note", async (req: Request, res: Response) => {
  try {
    const notes = await NoteModel.find();

    // Modificar los headers antes de enviar la respuesta
    res.setHeader("Access-Control-Allow-Origin", "https://super-to-do-front.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(200).json({ success: true, message: "Notas obtenidas", data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las notas", data: error });
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
