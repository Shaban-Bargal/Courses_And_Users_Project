module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            return res.status(403).json({
                status: "Error",
                message: "You are not allowed to perform this action"
            });
        }
        next();
    }
} 