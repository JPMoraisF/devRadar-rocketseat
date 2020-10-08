//A FAZER:
//CRIAR O UPDATE E O DELETE

const axios = require('axios');
const Dev = require('../models/Dev');
const { response } = require('express');
const ParseStringAsArray = require('../utils/ParseStringAsArray');


module.exports = {
    async delete(req, res) {
        const { github_username } = req.query;
        console.log(github_username);
        const dev = Dev.deleteOne({ github_username });
        console.log(dev);
        res.json({ devs: [  ] });
        
    },

    async index(req, res) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
        const dev = await Dev.findOne({ github_username });
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