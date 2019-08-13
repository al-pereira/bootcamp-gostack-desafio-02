import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';

class SearchMeetupController {
    async index(req, res) {
        const dateParsed = parseISO(req.query.date);

        const page = req.query.page || 1;

        const lstMeetups = await Meetup.findAll({
            [Op.between]: [startOfDay(dateParsed), endOfDay(dateParsed)],
            limit: 10,
            offset: (page - 1) * 10,
            order: ['date'],
        });

        return res.json(lstMeetups);
    }
}

export default new SearchMeetupController();
