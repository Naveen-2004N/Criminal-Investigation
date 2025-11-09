import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schedule from "node-schedule";
import admin from './firebaseAdmin.js';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import criminalRoutes from './routes/criminalRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';



dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/criminals', criminalRoutes);
app.use('/api/detect', detectionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notify', notificationRoutes);

app.post("/schedule-notification", (req, res) => {
  const { message, token } = req.body;
  console.log(token)

  const date = new Date(Date.now() + 2 * 1000); // 5 seconds later
  schedule.scheduleJob(date, async () => {
    try {
      await admin.messaging().send({
        token: token,
        notification: {
          title: "Scheduled Notification",
          body: message,
        },
      });
      console.log("Notification sent:", message);
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  });

  res.json({ status: "Notification scheduled for 5 seconds later" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));