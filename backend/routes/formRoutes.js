import { Router } from "express";
import { verifyToken } from "../middleware/verifyIdToken.js";
import { deleteAForm, getAllForms, postAForm, upload, getFormById } from "../controllers/formControls.js";
const GCGFormRoute = Router()
    
GCGFormRoute.get('/admin/getforms', getAllForms)
GCGFormRoute.get('/admin/:formname/:id', getFormById)

GCGFormRoute.post('/user/submit/:formname', upload.fields([{ name: 'photo', maxCount: 1 },{ name: 'idProof', maxCount: 1 },{ name: 'academicRecords', maxCount: 1 }]), postAForm)


// Add Verify Token Everywhere
export default GCGFormRoute