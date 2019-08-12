import File from '../models/File';

class FileController {
    async store(req, res) {
        const { originalname: original_name, filename: new_name } = req.file;

        const file = await File.create({
            original_name,
            new_name,
        });

        return res.json(file);
    }
}

export default new FileController();
