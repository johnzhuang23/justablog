require('../models/database')
const Category = require('../models/Category')
const Article = require('../models/Article')

exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber)
        const latest = await Article.find({}).sort({ _id: -1 }).limit(limitNumber)
        const study = await Article.find({ "category": "Study" }).limit(limitNumber)
        const fantasy = await Article.find({ "category": "Fantasy" }).limit(limitNumber)
        const it = await Article.find({ "category": "IT" }).limit(limitNumber)
        const fashion = await Article.find({ "category": "Fashion" }).limit(limitNumber)
        const articles = { latest, study, it, fantasy, fashion }

        res.render('index', {
            title: 'Home',
            user: req.session.user,
            categories,
            articles
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error Occured'
        })
    }
}

exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber)

        res.render('categories', {
            title: 'Categories',
            user: req.session.user,
            categories
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error Occured'
        })
    }
}

exports.exploreArticles = async (req, res) => {
    try {
        let articleId = req.params.id;

        const article = await Article.findById(articleId);

        res.render('articles', {
            title: 'Article',
            user: req.session.user,
            article
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error Occured'
        })
    }
}

// GET /categories/:id
exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Article.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', {
            title: 'Categoreis',
            user: req.session.user,
            categoryById
        });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// POST /search
exports.search = async (req, res) => {
    try {
        let search = req.body.searchTerm
        let article = await Article.find({ $text: { $search: search, $diacriticSensitive: true } })
        // res.json(article)
        res.render('search', {
            title: 'Search',
            user: req.session.user,
            article
        })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const article = await Article.find({}).sort({ _id: -1 }).limit(limitNumber)
        res.render('explore-latest', {
            title: 'Explore Latest',
            user: req.session.user,
            article
        })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.exploreRandom = async (req, res) => {
    try {

        let count = await Article.find().countDocuments()
        let random = Math.floor(Math.random() * count)
        let article = await Article.findOne().skip(random).exec()

        res.render('explore-random', {
            title: 'Explore Latest',
            user: req.session.user,
            article
        })
        // res.json(article)
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.submitArticle = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-article', {
        title: 'Publish',
        user: req.session.user,
        infoErrorsObj,
        infoSubmitObj
    });
}


exports.submitArticlePost = async (req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files uploaded');
        } else {
            imageUploadFile = req.files.image
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err)
                }
            })
        }

        const newArticle = new Article({
            title: req.body.title,
            author: req.session.user.username,
            description: req.body.description,
            category: req.body.category,
            image: newImageName,
            // author: req.body.author,

        })

        await newArticle.save();

        req.flash('infoSubmit', 'Article has been published.')
        res.redirect('/submit-article')

    } catch (error) {
        // res.json(error)
        req.flash('infoErrors', error)
        res.redirect('/submit-article')
    }
}


// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany(
//             [
//                 {
//                     "name": "Study",
//                     "image": "https://picsum.photos/id/1024/400/300"
//                 },
//                 {
//                     "name": "Fantasy",
//                     "image": "https://picsum.photos/id/1025/400/300"
//                 },
//                 {
//                     "name": "IT",
//                     "image": "https://picsum.photos/id/1026/400/300"
//                 },
//                 {
//                     "name": "Food",
//                     "image": "https://picsum.photos/id/1027/400/300"
//                 },
//                 {
//                     "name": "Travel",
//                     "image": "https://picsum.photos/id/1028/400/300"
//                 },
//                 {
//                     "name": "Fashion",
//                     "image": "https://picsum.photos/id/1029/400/300"
//                 }
//             ]
//         );
//     } catch (error) {
//         console.log('err:' + error)
//     }
// }

// insertDummyCategoryData();

// async function insertDummyArticleData() {
//     try {
//         await Article.insertMany(
//             [
//                 {
//                     title: "book 1",
//                     author: "author 1",
//                     date: Date.now(),
//                     category: "Study",
//                     image: "https://picsum.photos/id/1055/400/300",
//                     description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad nobis suscipit vel porro labore illum aperiam quibusdam exercitationem amet. Perspiciatis ut, temporibus soluta unde ducimus optio? Aperiam id laboriosam dignissimos?"

//                 },
//                 {
//                     title: "book 2",
//                     author: "author 2",
//                     date: Date.now(),
//                     category: "IT",
//                     image: "https://picsum.photos/id/1034/400/300",
//                     description: "Magni explicabo sapiente quis delectus quisquam sint odit, tempora veritatis neque excepturi quidem temporibus. Non nostrum adipisci reiciendis magnam deserunt nihil quis. Deleniti consectetur quas ullam fuga reiciendis, tenetur modi?"

//                 },
//                 {
//                     title: "book 3",
//                     author: "author 3",
//                     date: Date.now(),
//                     category: "Fantasy",
//                     image: "https://picsum.photos/id/1033/400/300",
//                     description: "Deleniti vitae rem quis nobis exercitationem. Iste quo iure numquam explicabo ullam non quae odit magnam aperiam dolore autem perspiciatis minus voluptatibus minima incidunt, deleniti cumque! Nemo asperiores accusamus quidem."

//                 },
//                 {
//                     title: "book 4",
//                     author: "author 4",
//                     date: Date.now(),
//                     category: "Fashion",
//                     image: "https://picsum.photos/id/1032/400/300",
//                     description: "Molestiae doloribus fugit quisquam expedita error, amet voluptates totam, tenetur ipsum temporibus hic ipsa molestias animi. Beatae ducimus sequi esse, corporis libero fugiat distinctio, vel non, voluptatum harum nisi nemo."

//                 },
//                 {
//                     title: "book 5",
//                     author: "author 5",
//                     date: Date.now(),
//                     category: "Food",
//                     image: "https://picsum.photos/id/1031/400/300",
//                     description: "Atque, optio est rerum quod eum explicabo quisquam sed, harum nihil soluta perspiciatis quasi nisi, aut suscipit dignissimos. Inventore non quasi consequatur impedit eius qui deserunt accusantium quibusdam alias tenetur?"

//                 },
//                 {
//                     title: "book 6",
//                     author: "author 6",
//                     date: Date.now(),
//                     category: "Travel",
//                     image: "https://picsum.photos/id/1030/400/300",
//                     description: "098li4u1hlijhfspdoufasdp987elkrjhblakdjvh;cozihvp08asdf0p97roihblkjabvlodsaiuf[dsufliasjdbhflkajsbvlicjzhvloahsdpf8uqlejifblkajbvliasjhdo;sdhfpoiahsbvlckzjbc."

//                 },
//             ]);
//     } catch (error) {
//         console.log('err:' + error)
//     }
// }

// insertDummyArticleData();
