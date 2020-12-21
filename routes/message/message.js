const router = require("express").Router();
const Message = require("../../models/Message/Message");
router.get("/:sender/:reciver",async(req,res) => {
    // const message = await Message.find({sender:req.params.sender,reciver:req.params.reciver}).sort("createdOn").exec((err,docs) => {
    //     res.status(200).json(docs);
    // })
    try {
        const message = await Message.find({ $or:
            [
                {sender:req.params.sender,reciver:req.params.reciver},
                {sender:req.params.reciver,reciver:req.params.sender}
            ]
        })
        res.status(200).json(message)
    } catch (error) {
        
    }
});

module.exports = router;