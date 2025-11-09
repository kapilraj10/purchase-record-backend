import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

const app = express();

// Load environment variables from src/.env (file is stored in src/ in this repo)
// If you prefer .env at project root, move the file up one level and revert to `dotenv.config()`
dotenv.config({ path: './src/.env' });
// Simple request logger to help debug incoming requests from the frontend
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.use(cors({
  origin: "http://localhost:3000"
  
  ,
  credentials: true,
}));

// Lightweight health endpoint for quick connectivity checks
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

connectDB();

app.get('/', (req, res) =>{
    res.send("Hello Developer!");
})

const PORT = process.env.PORT || 3000;
// Bind to 0.0.0.0 so the server accepts connections on all interfaces (helpful in containers/VMs)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})