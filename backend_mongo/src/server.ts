/* eslint-disable @typescript-eslint/no-unused-vars */
import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import articleRoutes from './routes/article';
import restaurantRoutes from './routes/restaurant';
import orderRoutes from './routes/order';
import logRoutes from './routes/log';

const NAMESPACE = 'Server';
const router = express();

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(() => {
    logging.info(NAMESPACE, 'Mongo Connected');
  })
  .catch(error => {
    logging.error(NAMESPACE, error.message, error);
  });

/** Log the request */
router.use((req, res, next) => {
  /** Log the req */
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    /** Log the res */
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
router.use(bodyParser.json({ limit: '50mb' }));

/** Rules of our API */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

/** Routes go here */
router.use('/api/articles', articleRoutes);
router.use('/api/restaurants', restaurantRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/logs', logRoutes);

/** Error handling */
router.use((req, res) => {
  const error = new Error('Not found');

  res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);
const options = {
  cors: {
    origin: [
      'http://localhost:8081',
      'http://localhost:8080',
      'http://localhost:8082',
      'http://10.117.129.194',
      'http://10.117.129.194:8082',
      'http://10.117.129.194:8080',
      'http://10.117.129.194:8081',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['X-Server-Select'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(httpServer, options);
io.on('connection', (socket: any) => {
  console.log(socket.id);
  socket.emit('messageChannel', 'datagyyggg');
  socket.on('messageChannel', (data: any) => {
    console.log('coucou');
    io.emit('messageChannel2', 'fds');
  });

  socket.on('OrderCreate', (msg: any) => {
    console.log('OrderCreate');
    console.log(msg);
    io.emit('OrderIsCreate', 'OrderIsCreate');
  });

  socket.on('OrderAcceptRestaurant', (msg: any) => {
    console.log('OrderAcceptRestaurant');
    console.log(msg);
    io.emit('OrderIsAcceptRestaurant', 'OrderIsAcceptRestaurant');
  });

  socket.on('OrderAcceptLivreur', (msg: any) => {
    console.log('OrderAcceptLivreur');
    console.log(msg);
    io.emit('OrderIsAcceptLivreur', 'OrderIsAcceptLivreur');
  });

  socket.on('OrderLivre', (msg: any) => {
    console.log('OrderLivre');
    console.log(msg);
    io.emit('OrderIsLivre', 'OrderIsLivre');
  });
});

httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `Server is running ${config.server.hostname}:${config.server.port}`
  )
);
