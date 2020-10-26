const router = require("express").Router();
const autho = require("../../middleware/autho");
const Task = require("../../models/Task");

// create a task
// private route
router.get("/create", autho, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// read a task by id
// private route
router.get("/:id", autho, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(400).send("Task doesnt exist");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all the task you created
// private
router.get("/", autho, async (req, res) => {
  try {
    await req.user.populate("tasks").execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update task u created
// private

router.patch("/:id", autho, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid Update");
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(400).send("Task doesnt exist");
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id",autho,async(req,res) => {
   try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});
    if(!task) {res.status(400).send("Task doesn`t exist.")};
    task.save();
    return res.send(task);
   } catch (error) {
       res.status(500).send("Internal server error.")
   }
    
});

module.exports = router;
