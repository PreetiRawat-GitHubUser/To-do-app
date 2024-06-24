const router = require('express').Router()

//routes
router.get("/add/todo",(req, res)=>{
    const {todo} = req.body;
    console.log(todo);
})


module.exports = router;