import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
    async index(req, res) {
        const lstMeetups = await Meetup.findAll({
            where: { user_id: req.userId },
        });

        return res.json(lstMeetups);
    }

    async store(req, res) {
        /**
         * Validação dos campos
         */
        const schema = Yup.object().shape({
            image_id: Yup.number().required(),
            title: Yup.string().required(),
            description: Yup.string().required(),
            location: Yup.string().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ mensagem: 'Erro na validação dos campos' });
        }

        /**
         * Checa se a data informada já passou
         */
        const dateISO = parseISO(req.body.date);

        if (isBefore(dateISO, new Date())) {
            return res
                .status(400)
                .json({ mensagem: 'A data informada já passou' });
        }

        /**
         * Se passou nas checagens acima
         */
        const user_id = req.userId;
        const meetup = await Meetup.create({
            ...req.body,
            user_id,
        });

        return res.json(meetup);
    }

    async update(req, res) {
        /**
         * Validação dos campos
         */
        const schema = Yup.object().shape({
            image_id: Yup.number().required(),
            title: Yup.string().required(),
            description: Yup.string().required(),
            location: Yup.string().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ mensagem: 'Erro na validação dos campos' });
        }

        const user_id = req.userId;

        /**
         * Checa se o usuário é o dono do meetup
         */
        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            res.status(401).json({
                mensagem:
                    'Seu usuário não tem permissão para alterar este meetup.',
            });
        }

        /**
         * Checa se a data informada na requisição já passou
         */
        const dateISO = parseISO(req.body.date);

        if (isBefore(dateISO, new Date())) {
            return res
                .status(400)
                .json({ mensagem: 'A data informada já passou' });
        }

        /**
         * Checa se o meetup já aconteceu
         */
        if (meetup.past) {
            return res.status(400).json({
                mensagem: 'Não é possível alterar meetup´s que já ocorreram',
            });
        }

        /**
         * Se passou pelas checagens acima atualiza o meetup
         */
        await meetup.update(req.body);

        return res.json(meetup);
    }

    async delete(req, res) {
        const user_id = req.userId;

        /**
         * Checa se o usuário é o dono do meetup
         */
        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            res.status(401).json({
                mensagem:
                    'Seu usuário não tem permissão para excluir este meetup.',
            });
        }

        /**
         * Checa se o meetup já aconteceu
         */
        if (meetup.past) {
            return res.status(400).json({
                mensagem: 'Não é possível excluir meetup´s que já ocorreram',
            });
        }

        /**
         * Se passou pelas checagens acima exclui o meetup do banco
         */
        await meetup.destroy();

        return res.send();
    }
}

export default new MeetupController();
