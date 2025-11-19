const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controlles");
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const filename = `user -${Date.now()}.${ext}`
        cb(null, filename)
    }
})

const upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(null, false);
        }
    }
})


router.route("/")
    .get(usersController.getAllUsers)

router.route("/register")
    .post(upload.single('avatar'), usersController.register)

router.route("/login")
    .post(usersController.login)

module.exports = router;