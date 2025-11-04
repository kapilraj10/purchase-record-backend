import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

connectDB();

app.get('/', (req, res) =>{
    res.send("Hello Developer!");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})