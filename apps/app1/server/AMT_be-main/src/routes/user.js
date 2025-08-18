import express from 'express'
import UserController from '../controller/user.js'
import Validate from '../middleware/Validate.js';
import AdminGuard from '../middleware/AdminGuard.js';
const router =express.Router();

router.get('/',AdminGuard,UserController.getAllUsers)
router.get("/allassets",Validate,UserController.getAllAssets)
router.get("/editasset/:id",Validate,UserController.getAssetById) 
router.post( '/signup',UserController.signUp)
router.post( "/login",UserController.login);
router.post( "/generate-bill",UserController.pdfGenerator);
router.post("/addassets",AdminGuard,Validate,UserController.addAssets);
router.put("/allassets/:id",AdminGuard,Validate,UserController.editAssets)
router.delete("/deleteasset/:id",AdminGuard,Validate,UserController.deleteAsset)    

export default router