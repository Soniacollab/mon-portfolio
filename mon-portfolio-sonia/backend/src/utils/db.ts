// src/utils/db.ts
// Connexion à MongoDB Atlas via mongoose.
// Utilisé par server.ts pour ouvrir la connexion au démarrage.
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI introuvable dans .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      // options par défaut depuis mongoose 6+, tu peux ajouter des options si besoin
    });
    console.log("MongoDB connecté ✅");
  } catch (err) {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  }
};

export default connectDB;
