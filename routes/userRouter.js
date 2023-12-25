// userRouter.js
const express = require('express');
const router = express.Router();
const userController = require("../controllers/userControler");


router.post("/register", userController.register);
router.post("/login", userController.loginController);
router.post("/setAvatar/:id", userController.setAvatar);
router.get("/allUsers/:id", userController.getAllUser);
router.get("/allContacts",userController.allContact)
module.exports = router;
