const router = require("express").Router();
const Message = require("../../models/Message/Message");
router.get("/:sender/:reciver",async(req,res) => {
    const message = await Message.find({sender:req.params.sender,reciver:req.params.reciver}).sort("createdOn").exec((err,docs) => {
        res.status(200).json(docs);
    })
});

module.exports = router;