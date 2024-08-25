import Jwt from "jsonwebtoken";

const checkAuthorization = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            return res
                .status(400)
                .json({ succes: false, message: "you are not logged in" });
        const decryptedata = Jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decryptedata.userId;
        next();
    } catch (err) {
        console.log(err);
    }
}

export default checkAuthorization;
