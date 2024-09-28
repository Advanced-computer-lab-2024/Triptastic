const adminModel = require('../models/Admin.js');
const { default: mongoose } = require('mongoose');
const createAdmin = async (req, res) => {
    
    const { Username, Password, Role } = req.body;
    try {
        const admin = await adminModel.create({ Username, Password, Role });
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}




module.exports = {createAdmin };