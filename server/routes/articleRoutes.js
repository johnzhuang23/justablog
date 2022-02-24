const express = require('express');
const { route } = require('express/lib/router');
const router = express.Router();
const articleController = require('../controllers/articleController');
const loginChecker = require('../controllers/loginchecker.js')


router.get('/', articleController.homepage)

router.get('/categories', loginChecker.loginNo)
router.get('/categories', articleController.exploreCategories)

router.get('/article/:id', loginChecker.loginNo)
router.get('/article/:id', articleController.exploreArticles)

router.get('/categories/:id', articleController.exploreCategoriesById)
router.post('/search', articleController.search);
router.get('/explore-latest', articleController.exploreLatest)
router.get('/random-article', articleController.exploreRandom)

router.get('/submit-article', loginChecker.loginNo)
router.get('/submit-article', articleController.submitArticle)
router.post('/submit-article', articleController.submitArticlePost)

module.exports = router;