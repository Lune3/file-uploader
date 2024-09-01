const {Router} = require('express');

const drive = Router();

drive.get('/',(req,res) => {
    res.render("drive");
});
module.exports = drive;