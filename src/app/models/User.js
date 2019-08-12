import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        // Hook de criptografia
        this.addHook('beforeSave', async user => {
            // Se a senha existir
            if (user.password) {
                // Gera o hash da senha com nível de força 8
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    // Método checa se a senha informada pelo usuário está correta
    checkPassword(password) {
        /* Retorna verdadeiro ou falso se a senha informada pelo
           usuário bate com a senha cadastrada no banco de dados */
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
