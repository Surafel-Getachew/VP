const router = require("express").Router();
const Article = require("../../models/Article");
// const Article = require("../../models/Article");
const auth = require("../../middleware/auth");
const autho = require("../../middleware/autho");

// post request
// private route
// create Article
router.post("/", auth, async (req, res) => {
  const { title, body } = req.body;
  try {
    const article = new Article({
      title,
      body,
      owner: req.psychiatrist._id,
     
    });
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
    const article = await Article.find().sort({date:-1});
    res.json(article)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error");
  }
})


// get all the articles created by the psychiatrist

router.get("/find",auth,async (req,res) => {
  try {
    await req.psychiatrist.populate("articles").execPopulate();
    res.send(req.psychiatrist.articles)
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.get("/search",async(req,res) => {
  try {
    const article = await Article.find({$text: {$search:"meti"}});
    res.send(article)
    res.send("serach")
  } catch (error) {
    
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
