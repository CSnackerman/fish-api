import AnglerController from '@/controller/controller.angler.js';
import FishController from '@/controller/controller.fish.js';
import { PORT } from '@/database/config.js';
import express from 'express';

const app = express();

// config

app.disable('x-powered-by');

// middleware

app.use(express.json());

app.use((req, res, next) => {
  res.setTimeout(3000, () => {
    res.statusMessage = 'timed out';
    res.sendStatus(408);
  });

  next();
});

// routes
app.get('/', (req, res) => {
  res.send('Hello');
});

// angler
app.get('/angler/:anglerId', AnglerController.getById);
app.post('/angler', AnglerController.create);
app.put('/angler', AnglerController.update);

// fish
app.get('/fish', FishController.spawn);
app.put('/fish', FishController.caught);
app.delete('/fish', FishController.incinerate);

// catch-all route
app.all('*', (req, res) =>
  res.send(`[${req.method}] ${req.path} : Are you lost?`)
);

// start the server
app.listen(+PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
