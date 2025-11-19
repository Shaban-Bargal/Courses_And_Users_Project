require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");
const coursesRouter = require("./routes/courses_routes");
const usersRouter = require("./routes/user_routes")
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => console.log("Database connected")).catch((err) => console.log(err));

app.use(cors());
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.all(/.*/, (req, res) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: "This route does not exist"
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: err.statusText || httpStatusText.ERROR,
        message: err.message || 'Internal server error'
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});