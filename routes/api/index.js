let express = require('express');
let router = express.Router();
const passport = require('passport');
const jwtCheck = passport.authenticate('jwt', { session: false });


const usersCtrl = require('../../controllers/users');
const newsCtrl = require('../../controllers/news');

const errorHandler = (err, res) => {
    console.error("err", err);
    res.status(err.statusCode || 500).json({
        message: err ? (err.message || err).toString() : "Internal Error"
    });
};

router.post('/saveUserImage/:id', async (req, res) => {
    try {
        const result = await usersCtrl.addImage(req.params.id, req);
        res.json(result);
    } catch {
        errorHandler(err, res);
    }
});

router.put('/updateUser/:id', async (req, res) => {
    try {
        const result = await usersCtrl.update({...req.params, ...req.body});
        res.json(result);
    } catch (err) {
        errorHandler(err, res);
    }
});

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const result = await usersCtrl.delete({...req.params});
        res.json({
            data: result
        });
    } catch (err) {
        errorHandler(err, res);
    }
});


router.get('/getUsers', async (req, res) => {
    try {
        const result = await usersCtrl.getAll();
        res.json({
            data: result
        });
    } catch (err) {
        errorHandler(err, res);
    }
});

router.put('/updateUserPermission/:id', async (req, res) => {
    try {
        const result = await usersCtrl.update({...req.params, ...req.body});
        res.json(result);
    } catch (err) {
        errorHandler(err, res);
    }
});

router.get('/getNews', async (req, res) => {
    try {
        const result = await newsCtrl.getAll();
        res.json(result);
    } catch (err) {
        errorHandler(err, res);
    }
});

router.post('/newNews', async (req, res) => {
    try {
        await newsCtrl.add({...req.body});
        const result = await newsCtrl.getAll();
        res.json(result);
    } catch (err) {
        errorHandler(err, res);
    }
});

router.put('/updateNews/:id', async (req, res) => {
    try {
        const result = await newsCtrl.update({...req.params, ...req.body});
        res.json(result);
        res.json();
    } catch (err) {
        errorHandler(err, res);
    }
});

router.delete('/deleteNews/:id', async (req, res) => {
    try {

        res.json();
    } catch (err) {
        errorHandler(err, res);
    }
});


module.exports = router;
