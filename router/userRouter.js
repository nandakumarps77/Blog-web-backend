import  express  from "express";
import { getUser, userfunction } from "../controller/userFunction.js";
import checkAuthorization from "../middleware/checkAuthorization.js";

const router = express.Router();


router.post("/createUser", userfunction);
router.get("/getUser",checkAuthorization, getUser);


export default router;