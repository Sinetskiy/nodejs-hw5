const News = require('../db/models/news');
const User = require('../db/models/user');

const resultItemConverter = (news) => {
    const {_id: id, text, theme, date, image, userId} = news;
    return {id, text, theme, date, image, user: {imgae: ""}};
};

exports.getAll = () => new Promise(async (resolve, reject) => {
    try {
        const result = await News.find();

        resolve(result.map((item) => resultItemConverter(item)));
    } catch (err) {
        reject({
            message: err,
            statusCode: 500
        });
    }
});

exports.get = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            return reject('id is required');
        }

        const result = await News.findById(id);

        resolve(resultItemConverter(result));
    } catch (err) {
        reject(err);
    }
});

exports.add = ({text, theme, date, image, userId}) => new Promise(async (resolve, reject) => {
    try {

        const news = new News({
            text,
            theme,
            date,
            image,
            userId
        });
        const result = await news.save();

        resolve(resultItemConverter(result));
    } catch (err) {
        reject(err);
    }
});

exports.update = ({id, text, theme, date, image, userId}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            return reject('id is required');
        }

        const news = await News.findById(id);

        if (text)
            news.set({text});
        if (theme)
            news.set({theme});
        if (date)
            news.set({date});
        if (image)
            news.set({image});
        if (userId)
            news.set({userId});

        await news.save();
        const result = await User.find();
        resolve(result.map((item) => resultItemConverter(item)));
    } catch (err) {
        reject(err);
    }
});

exports.delete = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            return reject('id is required');
        }
        await News.findByIdAndRemove(id);

        resolve(true);
    } catch (err) {
        reject(err);
    }
});
