import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Subscription from '../models/Subsciption';

class SubscriptionController {
    async index(req, res) {
        const user_id = req.userId;

        const lstSubscrptions = await Subscription.findAll({
            where: { user_id },
            include: [
                {
                    model: Meetup,
                    where: {
                        date: {
                            [Op.gt]: new Date(),
                        },
                    },
                    required: true,
                },
            ],
        });

        return res.json(lstSubscrptions);
    }

    async store(req, res) {
        const user = await User.findByPk(req.userId);

        /**
         * Checa se o usuário é o dono do meetup
         */
        const meetup = await Meetup.findByPk(req.params.meetupId, {
            include: [
                {
                    model: User,
                    attributes: ['name', 'email'],
                },
            ],
        });

        if (meetup.user_id === user.id) {
            res.status(401).json({
                mensagem: 'Você não pode se increver no seu próprio meetup.',
            });
        }

        /**
         * Checa se o meetup já aconteceu
         */
        if (meetup.past) {
            return res.status(400).json({
                mensagem:
                    'Não é possível se inscrever em meetup´s que já ocorreram',
            });
        }

        /**
         * Checa se o usuário já está inscrito no meetup informado
         */
        const userSubscribed = await Subscription.findOne({
            where: {
                meetup_id: req.params.meetupId,
                user_id: user.id,
            },
        });

        if (userSubscribed) {
            return res
                .status(400)
                .json({ mensagem: 'Você já está inscrito neste meetup' });
        }

        /**
         * Checa se o usuário já está ocupado com outro meetup na mesma data/hora
         */
        const busyTime = await Subscription.findOne({
            where: {
                user_id: user.id,
            },
            include: [
                {
                    model: Meetup,
                    required: true,
                    where: {
                        date: meetup.date,
                    },
                },
            ],
        });

        if (busyTime) {
            return res.status(400).json({
                mensagem:
                    'Você está inscrito em outro meetup nessa mesma data/horário',
            });
        }

        /**
         * Se passou por todas as checagens acima cria a inscrição no meetup
         */
        const subscription = await Subscription.create({
            user_id: user.id,
            meetup_id: meetup.id,
        });

        // Envia e-mail para o organizador do meetup
        await Queue.add(SubscriptionMail.key, {
            meetup,
            user,
        });

        return res.json(subscription);
    }
}

export default new SubscriptionController();
