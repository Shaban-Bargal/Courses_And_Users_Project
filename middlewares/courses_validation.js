const { body } = require("express-validator");


const validation = () => {
    return [body("title").notEmpty().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"), body("price").notEmpty().withMessage("Price is required")]
}

module.exports = validation