var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
module.exports = router;

// /wiki
router.get('/', function (req, res, next) {

    Page.findAll({})
        .then(function (pages) {
            res.render('index', {pages: pages});
        })
        .catch(next);

});

// /wiki
router.post('/', function (req, res, next) {

    User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email
            }
        })
        .spread(function (user) {
            return Page.create(req.body)
                .then(function (page) {
                    return page.setAuthor(user);
                });
        })
        .then(function (page) {
            res.redirect(page.get('route'));
        })
        .catch(next);

});

router.get('/search', function (req, res, next) {

    Page.findByTag(req.query.search)
        .then(function (pages) {
            res.render('index', {
                pages: pages
            });
        })
        .catch(next);

});

router.post('/:urlTitle', function (req, res, next) {

    Page.update(req.body, {
            where: {
                urlTitle: req.params.urlTitle
            },
            returning: true
        })
        .then(function () {
            return Page.findOne({
                where: {
                    urlTitle: req.params.urlTitle
                }
            });
        })
        .then(function (page) {
            res.redirect(page.get('route'));
        })
        .catch(next);

});

router.get('/:urlTitle/delete', function (req, res, next) {

    Page.destroy({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function () {
            res.redirect('/wiki');
        })
        .catch(next);

});

// /wiki/add
router.get('/add', function (req, res) {
    res.render('addpage');
});

// /wiki/(dynamic value)
router.get('/:urlTitle', function (req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            },
            include: [
                {model: User, as: 'author'}
            ]
        })
        .then(function (page) {
            if (page === null) {
                res.status(404).send();
            } else {
                res.render('wikipage', {
                    page: page
                });

            }
        })
        .catch(next);

});

router.get('/:urlTitle/edit', function (req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            },
            include: [
                {model: User, as: 'author'}
            ]
        })
        .then(function (page) {
            if (page === null) {
                res.status(404).send();
            } else {
                res.render('editpage', {
                    page: page
                });
            }
        })
        .catch(next);


});

// /wiki/(dynamic value)
router.get('/:urlTitle/similar', function (req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function (page) {
            if (page === null) {
                res.status(404).send();
            } else {
                return page.findSimilar()
                    .then(function (pages) {
                        res.render('index', {
                            pages: pages
                        });
                    });
            }
        })
        .catch(next);

});
