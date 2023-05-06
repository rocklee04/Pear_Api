const express = require("express");
const {UserModel} = require("../model/User.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: password of the user
 */
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All the API routes to users
 */
/** 
* @swagger
* /users/register:
*  post:
*       summary: To post the details of new user.
*       tags: [Users]
*       responses:
*           200:
*               description: User has been registered successfully.
*           400:
*               description: Bad request. An error occurred while registering the user.
*/
userRouter.post("/register",async (req, res) => {
    const {email, password, name} = req.body
    try {
        bcrypt.hash(password, 5,async (err, hash) => {
            const user = new UserModel({email, name, password: hash})
            await user.save();
            res.status(200).send({"msg": "New user has been registered"})
        });
 
    }catch(err) {
        res.status(400).json({"err": err.message})
    }
   
})

/** 
* @swagger
* /users/login:
*  post:
*       summary: To login the user.
*       tags: [Users]
*       responses:
*           200:
*               description: User has been login successfully.
*           400:
*               description: Bad request. An error occurred while login.
*/
userRouter.post("/login",async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    const token = jwt.sign({userID: user._id, author: user.name}, 'masai');
                    res.status(200).json({"msg": "Login Successfully", "token": token}) 
                } else {
                    res.status(200).json({"msg": "Wrong Credentials!!"})
                }
            });

        } else {
            res.status(200).json({"msg": "Wrong Credentials!!"})
        }
    }catch(err) {
        res.status(400).json({"err": err.message})
    }
})

module.exports = {
    userRouter
}