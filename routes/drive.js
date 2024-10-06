const {Router} = require('express');
const prisma = require('../db.js');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const cloudinary = require('cloudinary').v2;
const drive = Router();
const {format} = require('date-fns');
const { Public } = require('@prisma/client/runtime/library');

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
    secure: true
  });

drive.get('/',async (req,res) => {
    const folders = await prisma.folder.findMany({
        where:{
            parentId:req.session.user.rootFolder
        }
    })

    const files = await prisma.file.findMany({
        where:{
            FolderId:req.session.user.rootFolder
        }
    })
    res.render("drive",{folders:folders,route:null,files:files,username:req.session.user.username,format:format});
});

drive.get(`/newFolder`,(req,res) =>{
    res.render("folders");
});

drive.post('/newFolder',async(req,res) => {
    const user = req.session.user;
    const newFolder = await prisma.folder.create({
        data:{
            name:req.body.folderName || 'Untitled Folder',
            parentId:user.rootFolder
        }
    });
    res.redirect(`/drive`);
});


drive.get('/uploadFile', async (req,res) => {
    res.render("file");
});

drive.get('/uploadFile/:folderId', (req,res) => {
    res.render("file");
})

drive.post('/uploadFile/:folderId',upload.single('userFile') ,async (req,res) => {
    if(!req.file){
        return res.status(400).send('No file uploaded');
    }

    const userFile = req.file.originalname; 

    const fileSize = parseFloat(req.file.size);
    const fileSizeInKb = (fileSize / 1024);
    const fileSizeInMb = (fileSize / (1024 * 1024));

    const newFile = await prisma.file.create({
        data: {
            name: userFile,
            FolderId: req.params.folderId,
            size: fileSizeInKb
        }
    });

    const cloudinaryOptions = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto",
    }

    try {
        const uploadFile = await cloudinary.uploader.upload(req.file.path,cloudinaryOptions);
        console.log(uploadFile);
        const updateUrl = await prisma.file.update({
            where:{
                id:newFile.id
            },
            data:{
                fileUrl:uploadFile.secure_url
            }
        })
    } catch (error) { 
        console.log(error);
    }

    res.redirect(`/drive/${req.params.folderId}`)

});


drive.post('/uploadFile',upload.single('userFile') ,async(req,res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const userFile = req.file.originalname; 

    const fileSize = parseFloat(req.file.size);
    const fileSizeInKb =(fileSize / 1024);
    const fileSizeInMb = (fileSize / (1024 * 1024));


    
    const newFile = await prisma.file.create({
        data: {
            name: userFile,
            FolderId: req.session.user.rootFolder,
            size: fileSizeInKb
        }
    });

    const cloudinaryOptions = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto",
    }

    try {
        const uploadFile = await cloudinary.uploader.upload(req.file.path,cloudinaryOptions);
        const updateUrl = await prisma.file.update({
            where:{
                id:newFile.id
            },
            data:{
                fileUrl:uploadFile.secure_url,
                public_id:uploadFile.public_id
            }
        })
    } catch (error) { 
        console.log(error);
    }

    res.redirect("/drive");
});

drive.get('/:folderId',async (req,res) => {
    const selectedFolder = await prisma.folder.findMany({
        where:{
            parentId:req.params.folderId
        }
    })

    const subFiles = await prisma.file.findMany({
        where:{
            FolderId:req.params.folderId
        }
    })
    res.render("drive",{folders:selectedFolder,route:`${req.params.folderId}`,files:subFiles});
});

drive.get('/newFolder/:folderId',async (req,res) => {
    res.render("folders");
});

drive.post('/newFolder/:folderId',async (req,res) => {
    const parentFolder = req.params.folderId;
    const newFolder = await prisma.folder.create({
        data:{
            name:req.body.folderName || 'Untitled Folder',
            parentId:parentFolder
        }
    })
    res.redirect(`/drive/${parentFolder}`);
});



module.exports = drive;