import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize) {
        super.init(
            {
                original_name: Sequelize.STRING,
                new_name: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.APP_URL}/files/${this.new_name}`;
                    },
                },
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default File;
