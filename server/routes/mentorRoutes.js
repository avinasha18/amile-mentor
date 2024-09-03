import express from 'express';
import { registerMentor, loginUser, resetPassword, forgotPassword, getUser, updateMentor, VerifyMentorAccountwithToken,getStudentData } from '../controllers/mentorController.js';
import { VerifyUserAccountwithToken, resendVerification } from '../controllers/userController.js';
import {CheckAuthorization} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/register/mentor', registerMentor);
router.post('/mentor/verifyaccount', VerifyMentorAccountwithToken);
  
router.post('/login', loginUser);
router.post('/resendverification', resendVerification)

router.post('/resetpassword', resetPassword);

router.post('/forgotpassword', forgotPassword);
router.get('/mentordata', CheckAuthorization,getUser);
router.post('/mentordata',getUser)
router.post('/studentdata',getStudentData)
// router.post('/connectplugin',CheckAuthorization,connectPlugin);
router.post('/updatementor',CheckAuthorization,updateMentor);
// router.post('/disconnectplugin', disconnectPlugin);


export default router;
