import express from 'express';
import cors from 'cors';
import Pusher from 'pusher';

const port = 8000;

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

let messageArray = [];

const pusher = new Pusher({
  appId: '1481829',
  key: 'fb9820d492eae1a63e41',
  secret: '7ef70333e31118c60516',
  cluster: 'ap2',
  useTLS: true,
});

app.post('/api/send-message', (req, res) => {
  const message = req.body;
  pusher.trigger('messages', 'inserted', {
    type: 'add-message',
    message: message?.content,
  });

  messageArray.push(message?.content);
  res.status(201).send(messageArray);
});

app.get('/api/list-messages', (req, res) => {
  res.status(200).send(messageArray);
});

app.post('/api/flush', (req, res) => {
  const message = req.body;
  pusher.trigger('messages', 'inserted', {
    type: 'flush',
    message: message?.content,
  });

  messageArray = [];
  res.status(201).send(messageArray);
});

app.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port}`);
});
