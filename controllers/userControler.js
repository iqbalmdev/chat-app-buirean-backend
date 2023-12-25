// userController.js
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const registerController = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const isUserNameAvailable = await user.findOne({ username });
    console.log(isUserNameAvailable);
    if (isUserNameAvailable) {
      return res.json({
        msg: "user name is already taken",
        status: false,
      });
    }
    const isEmailAvailable = await user.findOne({ email });

    if (isEmailAvailable) {
      return res.json({
        msg: "email is already taken",
        status: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await user.create({
      email,
      username,
      password: hashedPassword,
    });

    delete response.password;

    return res.json({
      status: true,
      msg: response,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userResponse = await user.findOne({ username });
    if (!userResponse)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(
      password,
      userResponse.password
    );
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete userResponse.password;
    return res.json({ status: true, userResponse });
  } catch (ex) {
    next(ex);
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await user.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const userId = req?.params?.id;
    console.log(userId, "user id-----------");

 
    if (userId) {
    const  users = await user
        .find({ _id: { $ne: userId } }) // $ne means "not equal to"
        .select(["email", "username", "avatarImage", "_id"]);
        return res.json({
          user_id: userId,
          users: users,
          status: true
        });
    } else{
      return res.json({
        message:"wait",
        status:false
      })
    }


   
  } catch (ex) {
    next(ex);
  }
};


const allContact = async(req,res,next)=>{

console.log(req.params.id)
  const resp  = await req.params.id

return res.json({
  message:"successfull",
  status:true
})

}
module.exports = {
  register: registerController,
  loginController,
  setAvatar,
  getAllUser :getAllUsers,
  allContact
};
