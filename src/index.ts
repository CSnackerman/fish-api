import AnglerController from '@/controller/controller.angler.js';
import FishController from '@/controller/controller.fish.js';
import { NODE_ENV, PORT, TRUST_PROXY } from '@/database/config.js';
import express from 'express';
import rateLimit from 'express-rate-limit';

/* Init */

const app = express();

/* Config */

app.set('trust proxy', +TRUST_PROXY);
app.disable('x-powered-by');

/* Middleware */

// json parser
app.use(express.json());

// limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 75,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next, options) =>
      res
        .status(options.statusCode)
        .send(
          `${options.message} Limited to ${options.limit} requests per ${options.windowMs / 1000 / 60} minutes.`
        ),
  })
);

// request timeout
app.use((_, res, next) => {
  res.setTimeout(5000, () => {
    res.statusMessage = 'took too long. >5s';
    res.sendStatus(408);
  });

  next();
});

/* Routes */

// health
app.get('/', (req, res) => {
  res.send('Hello');
});

if (NODE_ENV !== 'prod') {
  app.get('/ip', (req, res) => res.send(req.ip));
}

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
