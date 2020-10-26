

const updates = Object.keys(req.body);
const allowUpdate = ["name","email","password"]

const isValidOperation = updates.every((update) => {
    allowUpdate.includes(update)
});

if(!isValidOperation){
    res.status(400).send("")
}
