const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const User = require('../db/models/user');

const resultItemConverter = (user) => {
    const {_id: id, username, firstName, middleName, surName, permission, image, access_token} = user;
    return {id, username, firstName, middleName, surName, permission, image, access_token};
};

exports.getAll = () => new Promise(async (resolve, reject) => {
    try {
        let result = await User.find();

        resolve(result.map((item) => resultItemConverter(item)));
    } catch (err) {
        reject({
            message: err,
            statusCode: 500
        });
    }
});

exports.add = ({username, email, password}) => new Promise(async (resolve, reject) => {
    try {

        const newUser = new User({
            username,
            email,
            password
        });

        const result = await newUser.save();
        console.log(resultItemConverter(result));
        resolve(resultItemConverter(result));
    } catch (err) {
        reject(err);
    }
});

exports.get = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            return reject('id is required');
        }

        const result = await User.findById(id);

        resolve(resultItemConverter(result));
    } catch (err) {
        reject(err);
    }
});

exports.update = ({id, firstName, middleName, surName, oldPassword, permission, password, image}) => new Promise(async (resolve, reject) => {
    try {

        if (!id) {
            return reject('id is required');
        }

        const user = await User.findById(id);
        if (firstName)
            user.set({firstName});
        if (middleName)
            user.set({middleName});
        if (surName)
            user.set({surName});
        if (image)
            user.set({image});
        if (password)
            user.setPassword(password);
        if (permission)
            user.setPassword(permission);

        const result = await user.save();

        resolve(resultItemConverter(result));
    } catch (err) {
        reject(err);
    }
});

exports.delete = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            return reject('id is required');
        }
        await User.findByIdAndRemove(id);

        resolve(true);
    } catch (err) {
        reject(err);
    }
});

exports.addImage = (id, req) => new Promise(async (resolve, reject) => {
    try {

        const form = new formidable.IncomingForm();
        const uploadDir = path.join(process.cwd(), 'public', 'assets', 'img');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        form.uploadDir = uploadDir;

        form.parse(req, (err, fields, files) => {

            if (err) {
                return next(err)
            }
            const {name: photoName, size, path: tempPath} = files[id];

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            if (!photoName || !size) {
                fs.unlinkSync(tempPath);
                return res.json({msg: 'File not saved', status: 'Error'});
            }

            fs.renameSync(tempPath, path.join(uploadDir, photoName));

            const imgPath = path.join('../','../','../', 'assets', 'img', photoName);

            resolve({path: imgPath});
        });
    } catch (err) {
        reject(err);
    }
});
