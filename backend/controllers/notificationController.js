import admin from 'firebase-admin';
import DeviceToken from '../models/deviceTokenModel.js';

const registerDevice = async (req, res) => {
  // ... (this function is correct, no changes)
  const { token } = req.body;
  const userId = req.user._id;

  if (!token) {
    return res.status(400).json({ message: 'Device token is required' });
  }

  try {
    await DeviceToken.updateOne(
      { token: token },
      { $set: { userId: userId } },
      { upsert: true }
    );
    
    res.status(201).json({ message: 'Device registered successfully' });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendDetectionNotification = async (req, res) => {
  const { criminalName, location } = req.body;

  try {
    const devices = await DeviceToken.find({});
    const tokens = devices.map((device) => device.token);

    if (tokens.length === 0) {
      return res.status(200).json({ message: 'No devices registered to notify' });
    }

    const message = {
      notification: {
        title: 'CRIMINAL DETECTED!',
        body: `${criminalName} spotted at ${location || 'current location'}.`,
        icon: '/shield-check.svg',
      },
      webpush: {
        fcmOptions: {
          link: 'https://your-frontend-domain.com/surveillance'
        }
      },
      tokens: tokens, // The list of tokens
    };

    // The correct function is 'sendEachForMulticast', not 'sendMulticast' or 'send'
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log('Notification sent successfully:', response);
    res.status(200).json({ message: 'Notification sent', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
};

export { registerDevice, sendDetectionNotification };