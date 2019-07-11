// Importações
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

// Cria uma instância de Router
const routes = new Router();

// Middlewares
routes.use(authMiddleware);

// Rotas
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.put('/users', UserController.update);

export default routes;
