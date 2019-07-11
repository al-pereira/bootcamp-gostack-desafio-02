// Importações
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    // Método de criação
    async store(req, res) {
        // Validação dos dados
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        // Se um ou mais dados da requisição não passarem na validação
        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ mensagem: 'Falha na validação dos campos' });
        }

        // Consulta no banco de dados se o usuário já existe
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        // Se o usuário já existe com o e-mail informado
        if (userExists) {
            return res.status(400).json({
                mensagem: 'Já existe um usuário cadastrado com este e-mail',
            });
        }

        // Cria o usuário no banco de dados e retorna os dados
        const { id, name, email, provider } = await User.create(req.body);

        // Retorna para requisição os dados criados
        return res.json({ id, name, email, provider });
    }

    // Método de atualização
    async update(req, res) {
        // Validação dos dados
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        // Se um dos dados não passarem na validação
        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ mensagem: 'Falha na validação dos dados' });
        }

        // Obtém dados enviados na requisição
        const { email, oldPassword } = req.body;

        // Obtém os dados do usuário consultando pela chave primária da tabela
        const user = await User.findByPk(req.userId);

        /*
			1ª Verificação: Se estiver alterando e-mail, checa se e-mail informado
			já está cadastrado em outro usuário
        */

        /* Se o e-mail recebido da requisição for diferente do e-mail do
           usuário logado */
        if (email !== user.email) {
            /* Recebe a consulta do usuário pelo e-mail recebido da requisição
               já existe no banco */
            const userExists = await User.findOne({ where: { email } });

            // Se já existe um usuário com o mesmo e-mail
            if (userExists) {
                return res
                    .status(400)
                    .json({ mensagem: 'Já existe um usuário com este e-mail' });
            }
        }

        /*
            2ª Verificação: Se o usuário informar a senha antiga, checa se a
            senha antiga está incorreta
        */
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ mensagem: 'Senha antiga incorreta' });
        }

        // Se passou pelas checagens acima

        // Executa a atualização dos dados do usuário e recebe os dados atualizados
        const { id, name, provider } = await user.update(req.body);

        // Retorna os dados atualizados
        return res.json({ id, name, email, provider });
    }
}

export default new UserController();
