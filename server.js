import express from 'express';
import cors from 'cors';
// import Pusher from 'pusher';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const port = 8000;

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.options('*', cors());

let messageArray = [];

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const pusher = new Pusher({
//   appId: '1481829',
//   key: 'fb9820d492eae1a63e41',
//   secret: '7ef70333e31118c60516',
//   cluster: 'ap2',
//   useTLS: true,
// });

app.post('/api/send-message', (req, res) => {
  const message = req.body;
  // pusher.trigger('messages', 'inserted', {
  //   type: 'add-message',
  //   message: message?.content,
  // });

  messageArray.push({ content: message?.content, type: 'text' });
  res.status(201).send(messageArray);
});

app.get('/api/list-messages', (req, res) => {
  res.status(200).send(messageArray);
});

app.post('/api/flush', (req, res) => {
  const message = req.body;
  // pusher.trigger('messages', 'inserted', {
  //   type: 'flush',
  //   message: message?.content,
  // });

  messageArray = [];
  res.status(201).send(messageArray);
});

app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  const audioData = req.file.buffer; // Buffer containing the audio file data

  const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString(16);
    const randomPart = Math.floor(Math.random() * 10000).toString(16);
    return `${timestamp}-${randomPart}`;
  };

  // Generate a unique ID
  const uniqueId = generateUniqueId();

  // Save the audio file locally
  const filePath = path.join(__dirname, 'uploads', `${uniqueId}.wav`);

  fs.writeFile(filePath, audioData, (err) => {
    if (err) {
      console.error('Error saving audio file:', err);
      res.status(500).send('Error saving audio file');
    } else {
      console.log('Audio file saved successfully:', filePath);

      messageArray.push({ content: `${uniqueId}.wav`, type: 'audio' });

      res.status(201).send({ content: `${uniqueId}.wav`, type: 'audio' });
    }
  });
  // Send a response
  // res.send('Audio file received!');
});

app.get('/api/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `uploads/${filename}`;
  res.sendFile(filePath, { root: __dirname });
});

app.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port}`);
});
