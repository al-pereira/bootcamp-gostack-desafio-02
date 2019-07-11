// Importações
import express from 'express';
import routes from './routes';
import './database';

class App {
    // Construtor da classe
    constructor() {
        this.server = express();

        // Chama os métodos da classe
        this.middlewares();
        this.routes();
    }

    // Método de middleware da aplicação
    middlewares() {
        // Configura a aplicação para trabalhar com requisões no formato json
        this.server.use(express.json());
    }

    // Método de definição das rotas da aplicação
    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
