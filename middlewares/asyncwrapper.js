module.exports = (fn) =>  {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            err.statusCode = 500
            next(err);
        });
    }
}