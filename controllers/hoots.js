const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const router = express.Router();

// add routes here

// POST '/hoots':
router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const hoot = await Hoot.create(req.body);
        hoot._doc.author = req.user;

        res.status(201).json(hoot);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }});


// GET '/hoots':

router.get('/', verifyToken, async (req, res) => {
    try {
        const hoots = await Hoot.find({})
        .populate('author')
        .sort({ createdAt: "desc" });
       
        res.status(200).json(hoots);
        
    } catch (error) {
        res.status(500).json({ err: error.message });
    }})

// GET '/hoots/:hood id':
router.get('/:hootId', verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId).populate('author');
        res.status(200).json(hoot);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }

});



// PUT '/hoots/:hootId':
router.put('/:hootId', verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId)

        //check permission: if the user is not the author of the hoot, return error
        if(!hoot.author.equals(req.user._id)) {
            return res.status(403).json({err: "You're not allowed to do that!"});
        }
        //if it is , update hoot:
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
             req.body, 
             {new: true}
            );

        
        res.status(200).json(updatedHoot);
    } catch (error) {
        res.status(500).json({err: error.message})
    }})





module.exports = router;
