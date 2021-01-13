const axios = require('axios');
const Dev = require('../models/Dev');
const ParseStringAsArray = require('../utils/ParseStringAsArray');

module.exports = {
    /**
     * 
     * @param {req} req requisicçao que chega
     * @param {res} res requisicao que sai
     */
    async updateDev(req, res) {
        const {github_username} = req.query;
        var dev = await Dev.findOne({github_username: github_username});
        if(!dev){
            // return res.json({"message": "document not found"});
            res.status(404).json({"message": "document not found"});
        }
        else{
            console.log(req.body);
            for (var [key, value] of Object.entries(req.body)) {
                
                dev = await Dev.updateOne({github_username: github_username}, {
                    $set: req.body,
                    $currentDate: {lastModified: true}
                });
                // dev[key] = value;
            }
            // dev = await Dev.replaceOne({github_username: github_username}, dev);
            /*
            dev = await Dev.updateOne({github_username: github_username},  {
                $set: {techs: req.body.techs},
                $currentDate: { lastModified: true}
            });
            */
           console.log(dev);
           return res.json({"message": "document updated", "modifiedDocuments": dev.nModified});
        }
    },

    async delete(req, res) {
        const { github_username } = req.body;
        const dev = await Dev.deleteOne({ github_username });
        if(dev.deletedCount === 0){
            return res.json({"message": "document not found", "deleted documents": dev.deletedCount});
        }
        else{
            res.json({"message": "document deleted", "deleted documents": dev.deletedCount});
        }
        
    },

    async index(req, res) {
        try{
            var devs = await Dev.find();
            return res.json(devs);
        } catch(e){
            console.log(e);
        } 
    },
    
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
        var dev = await Dev.findOne({ github_username });
        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = response.data;
            const techsArray = ParseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }
        else{
            return res.send("User already exists!");
        }
        return res.json(dev);
    }
    
};