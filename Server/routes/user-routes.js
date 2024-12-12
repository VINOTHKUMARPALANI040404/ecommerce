import { Router } from "express";
import { HomePage } from "../controllers/Home/HomePage.js";
import { RegisterPage } from "../controllers/Authentication/RegisterPage.js";
import { LoginPage } from "../controllers/Authentication/LoginPage.js";
import { verifyOtp } from "../controllers/Authentication/verifyOtp.js";
import { UserMiddleWare } from "../middleWare/userMiddleware.js";
import { AdminPage } from "../controllers/Admin/adminPage.js";
import { adminMiddleWare } from "../middleWare/adminMiddleware.js";
import { ResetPassword_Authentication, ResetPassword_Confirm } from "../controllers/Authentication/ResetPassword.js";


const auth_routes = Router()

auth_routes.get('/home',UserMiddleWare,HomePage)
auth_routes.get('/admin',UserMiddleWare,adminMiddleWare,AdminPage)
auth_routes.post('/register',RegisterPage)
auth_routes.post('/login',LoginPage)
auth_routes.post('/verify_otp',verifyOtp)
auth_routes.post('/rstpass',ResetPassword_Authentication)
auth_routes.post('/rstpass/confirmation',ResetPassword_Confirm)

export default auth_routes;