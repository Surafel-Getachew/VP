const router = require("express").Router();
const multer = require("multer");
const Article = require("../../models/Article");
const auth = require("../../middleware/auth");
const autho = require("../../middleware/autho");
var upload = multer({});

// post request
// private route
// create Article
router.post("/",upload.single("articlePhoto"),auth, async (req, res) => {
  const { title, body,articleTag} = req.body;
  console.log(title);
  try {
    // const article = new Article({
    //   title,
    //   body,
    //   articleTag,
    //   owner: req.psychiatrist._id,
     
    // });
    const article = await Article.create({
      title,
      body,
      articleTag,
      articlePhoto:req.file.buffer,
      owner: req.psychiatrist._id
    })
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).send(error);
  }
});



// get request 
// private route
// read articles

router.get("/",autho,async (req,res) => {
  try {
    let allArticles = []
    const articles = await Article.find().sort({date:-1});
    articles.forEach((article) => {
      let articleAvi  = Buffer.from(article.articlePhoto).toString("base64")
      let articleData = {
        ...article._doc,
        articlePhoto:articleAvi
      }
      allArticles.push(articleData)
    })
    res.json(allArticles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error");
  }
})


// get all the articles created by the psychiatrist

router.get("/find",auth,async (req,res) => {
  try {
    let myArticles = [];
    const articles = await Article.find({owner:req.psychiatrist._id});
    articles.forEach((article) => {
      let articleAvi = Buffer.from(article.articlePhoto).toString("base64");
      let articleList = {
        ...article._doc,
        articlePhoto:articleAvi
      }
      myArticles.push(articleList);
    })
    res.status(200).send(myArticles)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg:"Internal Server Error"})
  }
  // try {
  //   await req.psychiatrist.populate("articles").execPopulate();
  //   res.send(req.psychiatrist.articles)
  // } catch (error) {
  //   res.status(500).send("Internal server error")
  // }
})

router.post("/psychiatrist/search",auth,async(req,res) => {
  try {
    const {
      search 
    } = req.body
    let articleList = []
    const articles = await Article.find({owner:req.psychiatrist._id,$text: {$search:search}});
    articles.forEach((article) => {
      let articleAvi = Buffer.from(article.articlePhoto).toString("base64");
      let articleData = {
        ...article._doc,
        articlePhoto:articleAvi
      }
      articleList.push(articleData);
    })
    res.send(articleList);
    // res.send("serach")
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"})
    console.log(error.message);
  }
})

router.post("/search/all",async(req,res) => {
  try {
    const {
      searchText
    } = req.body
    let articleList = []
    const articles = await Article.find({$text:{$search:searchText}});
    articles.forEach((article) => {
      let articleAvi = Buffer.from(article.articlePhoto).toString("base64");
      let articleData = {
        ...article._doc,
        articlePhoto:articleAvi
      }
      articleList.push(articleData);
    })
    res.send(articleList);
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"})
  }
})

router.get("/category/:category",async(req,res) => {
  try {
    let articleList = []
    const articles = await Article.find({articleTag:req.params.category});
    articles.forEach((article) => {
      let articleAvi = Buffer.from(article.articlePhoto).toString("base64");
      let articleData = {
        ...article._doc,
        articlePhoto:articleAvi
      }
      articleList.push(articleData);
    })
    res.send(articleList);
  } catch (error) {
    res.status(500).send({msg:"Internal Server Error"})
  }
    
})

router.get("/findById/:id",async(req,res) => {
  try {
    const articles = await Article.findOne({_id:req.params.id});
    if (!articles) {
      return res.status(400).json({msg:"Article not found"})
    } else {
      const articleAvi = Buffer.from(articles.articlePhoto).toString("base64");
      const articleData  = {
        ...article._doc,
        articlePhoto:articleAvi
      };

      return res.status(200).json({articleData})
    }
  } catch (error) {
    return res.status(500).json({msg:"Internal Server Error"})
  }
})

// get a single article that are created by the psychiatrist
router.get("/:id",auth,async (req,res) => {
  const _id = req.params.id
  try {
    const article = await Article.findOne({_id,owner:req.psychiatrist._id});
    if(!article){
      res.status(400).send("Cant find the article")
    }
    res.send(article)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
})




// patch request
// private route
// update route

// router.patch("/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["title", "body"];
//   const isValidOperation = updates.every(update =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send("Invalid Updates");
//   } else {
//     const article = await Article.findOne({
//       _id: req.params.id,
//       owner: req.psychiatrist._id
//     });
//     if (!article) {
//       res.status(400).send("Cant find article");
//     }
//     try {
//       updates.forEach(update => {
//         article[update] = req.body[update];
//       });
//       await article.save();
//       res.send(article);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   }
// });



// ////////

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(400).send("cant find contact");
    } else {
      updates.forEach(update => {
        article[update] = req.body[update];
      });
    }
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ msg: "Internal server Error" });
  }
});



//delete route
// private route
// to delete an article.

router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: req.psychiatrist._id
    });
    if (!article) {
      res.status(400).send("Article not found");
    }
    res.status(200).send(article);
    await article.save();
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }
});




module.exports = router;
