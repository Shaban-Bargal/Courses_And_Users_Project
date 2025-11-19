const asyncWrapper = require("../middlewares/asyncwrapper");
const users = require("../models/users_model");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");


const getAllUsers = asyncWrapper(

    
    async (req, res) => {
        
        // console.log(req.headers.authorization);

        const query = req.query;

        const limit = query.limit || 10
        const page = query.page || 1

        const allUsers = await users.find({}, { "__v": false, "password": false }).limit(limit).skip((page - 1) * limit);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { users: allUsers }
        });
    }
)

const register = asyncWrapper(
    async (req, res) => {

        const { firstName, lastName, email, password  , role} = req.body

        const user = await users.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new users({ firstName, lastName, email, password: hashedPassword , role , avatar: req.file.filename } );

        // generate token
        const token = await generateToken({ email: newUser.email, id: newUser._id , role:newUser.role , avatar:newUser.avatar});
        // console.log(token);

        newUser.token = token;
        await newUser.save();

        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: {
                user: newUser
            }
        });
    }
)

const login = asyncWrapper(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: "Please provide email and password"
        });
    }

    const user = await users.findOne({ email });

    if (!user) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: "User does not exist"
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);


    if (user && isPasswordCorrect) {

        const token = await generateToken({ email: user.email, id: user._id , role:user.role });


        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { token }
        });
    } else {
        return res.status(500).json({
            status: httpStatusText.ERROR,
            message: "something went wrong"
        });
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}