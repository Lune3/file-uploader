const {Router} = require('express');
const prisma = require('../db.js');
const cloudinary = require('cloudinary').v2;
const deleteRoute = Router();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
    secure: true
});

const cloudinaryOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "auto",
}

deleteRoute.get('/:fileId',async (req,res) => {
    
    const deleteFile = await prisma.file.delete({
        where:{
            id:req.params.fileId
        }
    });

    res.redirect('back');
})


module.exports(deleteRoute);