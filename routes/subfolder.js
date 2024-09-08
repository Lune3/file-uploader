const {Router} = require('express');
const prisma = require('../db.js');

const subFolder = Router();

subFolder.get('/:folderId',async (req,res) => {
    const selectedFolder = await prisma.folder.findMany({
        where:{
            parentId:req.params.folderId
        }
    })
    res.render("drive",{folders:selectedFolder});
});

module.exports = subFolder;




