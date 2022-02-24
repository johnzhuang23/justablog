const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const loginChecker = require('../controllers/loginchecker.js')
var crypto = require('crypto');



router.get('/signup', loginChecker.loginYes)
router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
    console.log(req.session.user)
});

router.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let passwordRepeat = req.body.passwordRepeat;

    if (passwordRepeat != password) {
        req.flash('error', `Those passwords didn’t match. Try again`).toString();
        return res.redirect('/signup');
    }

    // if the username has existed or not
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            req.flash('error', err);
            return res.redirect('/signup');
        }
        if (user) {
            req.flash('This name has been used, please change another one.');
            return res.redirect('/signup');
        }

        // encrypt password
        let md5 = crypto.createHash('md5');
        let md5password = md5.update(password).digest('hex');


        var newUser = new User({
            username: username,
            password: md5password
        });

        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.redirect('/signup');
            }
            req.flash('Sign up successfully! Welcome!');
            newUser.password = null;
            delete newUser.password;
            req.session.user = newUser;
            return res.redirect('/');
        });
    });
});

// log in
router.get('/login', loginChecker.loginYes)
router.get('/login', (req, res) => {
    User.find((err, doc) => {
        res.render('login', {
            title: 'Log in',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            blog: doc
        })
    })
});

router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            req.flash("err", err);
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Username does not exist!');
            return res.redirect('/login');
        }

        let md5 = crypto.createHash('md5');
        let md5password = md5.update(password).digest('hex');

        if (user.password !== md5password) {
            req.flash('error', "incorrect password!");
            console.log(req.flash('error').toString())
            return res.redirect('/login')
        }

        req.flash('success', "Welcome back!");

        console.log(req.flash('success').toString());

        user.password = null;
        delete user.password;
        req.session.user = user;
        // console.log(req.session.user)
        return res.redirect('/')
    })
});

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success', 'You have logged out. See you next time!');
    console.log(req.flash('success').toString())
    return res.redirect('/');
});

module.exports = router;