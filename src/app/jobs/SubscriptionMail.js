import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }

    async handle({ data }) {
        const { meetup, user } = data;

        console.log('A fila executou');

        await Mail.sendMail({
            to: `${meetup.User.name} <${meetup.User.email}>`,
            subject: `O meetup "${meetup.title}" tem mais um inscrito`,
            template: 'subscription',
            context: {
                organizer: meetup.User.name,
                title: meetup.title,
                subscribed: user.name,
                email: user.email,
                date: format(
                    parseISO(meetup.date),
                    "dd 'de' MMMM', às 'H:mm'hs'",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new SubscriptionMail();
