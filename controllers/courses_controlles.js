const { validationResult } = require("express-validator");
const courses = require("../models/courses_model");
const asyncWrapper = require("../middlewares/asyncwrapper");
const httpStatusText = require("../utils/httpStatusText");
const asyncwrapper = require("../middlewares/asyncwrapper");
const appError = require("../utils/appErorr");


const getAllCourse = asyncWrapper(
    async (req, res) => {

        const query = req.query;

        const limit = query.limit || 10
        const page = query.page || 1

        const allCourses = await courses.find({}, { "__v": false }).limit(limit).skip((page - 1) * limit);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { courses: allCourses }
        });
    }
)

const getSingleCourse = asyncwrapper(

    async (req, res, next) => {
        const id = req.params.id;

        const course = await courses.findById(id);

        if (!course) {
            const erorr = appError.create("course not found", 404, httpStatusText.FAIL);
            return next(erorr);
        }

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { course }
        });
    }
)

const createCourse = asyncWrapper(

    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const erorr = appError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(erorr);
        }

        const newCourse = new courses(req.body);
        newCourse.save();
        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { course: newCourse }
        });

    }
)

const updateCourse = asyncWrapper(
    async (req, res) => {

        const id = req.params.id;

        if (!req.body) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                data: { course: "Empty body" }
            });
        }

        const updateCourse = await courses.updateOne({ _id: id }, { $set: { ...req.body } },);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { course: updateCourse }
        });

    }
)

const deleteCourse = asyncWrapper(
    async (req, res) => {
        const id = req.params.id;

        const deleteCourse = await courses.deleteOne({ _id: id });
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: null
        });

    }
)

module.exports = {
    getAllCourse,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
}