import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import databaseConfig from '../config/database';

const lstModels = [User, File];

class Database {
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
