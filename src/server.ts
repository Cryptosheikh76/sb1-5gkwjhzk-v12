import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { streamRouter } from './routes/stream';
import { nftRouter } from './routes/nft';
import { setupStreamHandlers } from './services/stream/handlers';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stream', streamRouter);
app.use('/api/nft', nftRouter);

// WebSocket handlers
setupStreamHandlers(io);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});