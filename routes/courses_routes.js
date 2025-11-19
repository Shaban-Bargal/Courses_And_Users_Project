const express = require("express");
const router = express.Router();
const validation = require("../middlewares/courses_validation");
const verivyToken = require("../middlewares/verifyAuth");   
const userRoles = require("../utils/user_roles");
const allowedTo = require("../middlewares/allowedTo");

const coursesController = require("../controllers/courses_controlles");

router.route("/")
    .get( verivyToken ,coursesController.getAllCourse)
    .post( verivyToken , validation(), coursesController.createCourse)

router.route("/:id")
    .get(coursesController.getSingleCourse)
    .patch(coursesController.updateCourse)
    .delete( verivyToken , allowedTo(userRoles.ADMIN , userRoles.MANGER) ,coursesController.deleteCourse);

module.exports = router;