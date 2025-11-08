import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Criminal from '../models/criminalModel.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env');
const dataPath = path.resolve(__dirname, '..', 'data', 'criminals.json');

dotenv.config({ path: envPath });

// --- Database Connection ---
connectDB();

// --- Data Loading ---
let criminalsData = [];
try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    criminalsData = JSON.parse(rawData);
} catch (error){
    console.error(`Could not read or parse criminals.json: ${error}`);
    process.exit(1);
}

const importData = async () => {
  try {
    await Criminal.deleteMany();
    
    const sampleCriminals = criminalsData.slice(0, 10); // Use the first 10 templates
    
    const fullData = [];
    for (let i = 0; i < 50; i++) {
        const template = sampleCriminals[i % sampleCriminals.length];
        const criminal = { ...template };
        
        criminal.name = `${template.name} #${i + 1}`; 
        
        // Use a more reliable placeholder image service
        const firstName = template.name.split(' ')[0];
        criminal.images = [`https://placehold.co/400x400/222/fff?text=${firstName}`];

        fullData.push(criminal);
    }

    await Criminal.insertMany(fullData);

    console.log('\x1b[32m%s\x1b[0m', 'Data Imported Successfully! (50 Records)');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Criminal.deleteMany();
    console.log('\x1b[31m%s\x1b[0m', 'Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
