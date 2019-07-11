// Importações
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    // Busca a autorização dentro do header da requisição
    const authHeader = req.headers.authorization;

    // Se não existir token no header
    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não enviado' });
    }

    // Se o token foi enviado

    const [, token] = authHeader.split(' ');

    try {
        // Recebe token decodificado
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        /* Se não houve erro na decodificação do token adiciona o ID do usuário
           na requisição */
        req.userId = decoded.id;

        return next();
    } catch (err) {
        // Se houve erro na decodificação do token retorna status code 401
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
};
