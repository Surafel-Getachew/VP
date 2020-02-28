const router = require("express").Router();
const Article = require("../../models/Article");
const auth = require("../../middleware/auth");

// post request
// private route
// create news
router.post("/", auth, async (req, res) => {
  const { Header, description } = req.body;
  try {
    const article = new Article({
      Header,
      description,
      owner: req.psychiatrist._id
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).send(error);
  }
});
// get request
// private route
// get a single the article created.

router.get("/:id",auth, async (req,res) => {
  try {
    const article = await Article.findById(req.params.id);
    await req.psychiatrist.populate("articles").execPopulate();
    res.status(200).json(req.psychiatrist.article)
    // const article = await Article.findById(req,params.id);
    // await article.populate("owner").execPopulate();
    // res.status(200).send(article.owner);
  } catch (error) {
    
  }
})



// get request
// private route
// get all the news created
router.get("/all", auth, async (req, res) => {
  try {
    await req.psychiatrist.populate("articles").execPopulate();
    res.status(200).json({
      article: req.psychiatrist.articles,
      createdby: req.psychiatrist.name
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// patch request
// private route
// update route

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["Header", "description"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid Updates");
  } else {
    const article = await Article.findOne({
      _id: req.params.id,
      owner: req.psychiatrist._id
    });
    if (!article) {
      res.status(400).send("Cant find article");
    }
    try {
      updates.forEach(update => {
        article[update] = req.body[update];
      });
      await article.save();
      res.send(article);
    } catch (error) {
      res.status(500).send(error);
    }
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
    await article.save();
    res.status(200).send(article);
  } catch (error) {}
});

module.exports = router;
