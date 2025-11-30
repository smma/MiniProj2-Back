const Expert = require('../models/expert.model');
const {
    validationResult
} = require('express-validator');
const ExpertMessages = require("../messages/expert.messages");

exports.get = async (req, res) => {
    try {
        const experts = await Expert.find(req.query);
        let message = ExpertMessages.success.s2;

        if (experts.length === 0)
            message = ExpertMessages.success.s5;

        message.body = experts;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const expert = await new Expert({
        name: req.body.name,
        profession: req.body.profession,
        yearsOfExperience: req.body.yearsOfExperience
    }).save();
        let message = ExpertMessages.success.s0;
        message.body = expert;
        return res.header("location", "/experts/" + expert._id).status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const expert = await Expert.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);

        let message = ExpertMessages.success.s1;
        message.body = expert;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Expert.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s3.http).send(ExpertMessages.success.s3);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const expert = await Expert.findOne({
            _id: req.params.id
        });
        
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        let message = ExpertMessages.success.s2;
        message.body = expert;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

