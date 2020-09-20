import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import config from '../env';

const dbConnect = () =>
  new Promise((resolve, reject) => {
    mongoose.set('useNewUrlParser', true);
    mongoose.connect(config.databaseUrl, {
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
      console.log('Connected');
      resolve('connected');
    });

    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose default connection error: ${err}`);
      reject(new Error(`Error in connection ${err}`));
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected');
    });
  });

const dbDisconnect = () => mongoose.connection.close();

export default { dbConnect, dbDisconnect };
