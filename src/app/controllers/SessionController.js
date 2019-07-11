import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    // Cria uma sessão
    async store(req, res) {
        // Validação dos dados
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        // Se um dos dados não passar na validação
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ mensagem: 'Dados inválidos' });
        }

        // Recebe e-mail e a senha da requisição
        const { email, password } = req.body;

        // Consulta no banco se existe usuário cadastrado com o e-mail informado
        const user = await User.findOne({ where: { email } });

        // Se o usuário não existe no banco de dados
        if (!user) {
            // Retorna status code 401 - Não Autorizado
            return res
                .status(401)
                .json({ mensagem: 'Usuário não encontrado com este e-mail' });
        }

        // Se a senha NÃO estiver correta
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ mensagem: 'Senha incorreta' });
        }

        // Se passar pelas verificações de autenticidade acima

        // Recebe os dados do usuário
        const { id, name } = user;

        // Retorna os dados do usuário com o token
        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
