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


deleteRoute.get('/file/:fileId',async (req,res) => {
    
    const deleteFile = await prisma.file.delete({
        where:{
            id:req.params.fileId
        }
    });
    let resource_type = 'raw';
    try {
        const result = await cloudinary.api.resource(deleteFile.public_id);
        resource_type = result.resource_type;
    } catch (error) {
        console.log('Error fetching resource from cloudinary',error);
    }
    

    try{
        const deleteFileFromCloudinary = await cloudinary.uploader.destroy(deleteFile.public_id,{resource_type:`${resource_type}`});
    }
    catch(err){
        console.log('Error deleting file from cloudinary',err);
    }


    res.redirect('back');
});

deleteRoute.get('/folder/:folderId', async (req, res) => {
    try {
        const filesToDelete = await prisma.file.findMany({
            where: {
                FolderId: req.params.folderId
            }
        });

        for (const file of filesToDelete) {
            if (file.public_id) {
                try {
                    await cloudinary.uploader.destroy(file.public_id);
                } catch (err) {
                    console.log('Error deleting file from Cloudinary:', err);
                }
            }
        }

        await prisma.file.deleteMany({
            where: {
                FolderId: req.params.folderId
            }
        });

        await deleteSubfolders(req.params.folderId);

        const deleteFolder = await prisma.folder.delete({
            where: {
                id: req.params.folderId
            }
        });

        res.redirect('back');
    } catch (error) {
        console.log('Error deleting folder:', error);
    }
});

async function deleteSubfolders(folderId) {
    const subfolders = await prisma.folder.findMany({
        where: {
            parentId: folderId
        }
    });

    for (const subfolder of subfolders) {
        const filesToDelete = await prisma.file.findMany({
            where: {
                FolderId: subfolder.id
            }
        });

        for (const file of filesToDelete) {
            if (file.public_id) {
                try {
                    await cloudinary.uploader.destroy(file.public_id);
                } catch (err) {
                    console.log('Error deleting file from Cloudinary:', err);
                }
            }
        }

        await prisma.file.deleteMany({
            where: {
                FolderId: subfolder.id
            }
        });

        await deleteSubfolders(subfolder.id);

        await prisma.folder.delete({
            where: {
                id: subfolder.id
            }
        });
    }
}


module.exports=deleteRoute;