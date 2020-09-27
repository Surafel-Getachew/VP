const express = require ("express")
const router = express.Router();
router.get("/room/:roomId",(req,res) => {
    res.send("video chat started....")
})

module.exports = router;