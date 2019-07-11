// Importações
import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

// Array (lista) de models
const lstModels = [User];

// Classe
class Database {
    // Construtor da classe
    constructor() {
        this.init();
    }

    init() {
        // Cria uma instância da conexão
        this.connection = new Sequelize(databaseConfig);

        /* Percorre a lista modelos no array e inicializa a conexão
           com o banco de dados */
        lstModels.map(m => m.init(this.connection));
    }
}

export default new Database();
