const router = require("express").Router()

//routes are here

router.get("/",(req, res)=> {
    res.render("index")
})

module.exports = router;