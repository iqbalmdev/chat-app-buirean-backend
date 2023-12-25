// userRouter.js
const messageController = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addmsg",messageController.addMessage);
router.post("/getmsg",messageController.getAllMessage)
// router.post("/getmsg/", getMessages);

module.exports = router;