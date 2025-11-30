const UserLeveL = require("../models/userlevel.model");
const UserLevelMessages = require("../messages/userlevel.messages");
const {
    validationResult
} = require('express-validator');

exports.get = async (req, res) => {

    try {
        const levels = await UserLeveL.find(req.query);

        let message = UserLevelMessages.success.s2;

        if (levels.length === 0)
            message = UserLevelMessages.success.s4;

        message.body = levels;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user_level = await UserLeveL.findOne({
            _id: req.params.id
        });
        
        if (!user_level) return res.status(UserLevelMessages.error.e0.http).send(UserLevelMessages.error.e0);
        let message = UserLevelMessages.success.s2;
        message.body = user_level;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user_level = await new UserLeveL({
            name: req.body.name,
            level: req.body.level,
            avatar: req.body.avatar,
            max: req.body.max
        }).save();

        let message = UserLevelMessages.success.s0;
        message.body = user_level;
        return res.header("location", "/users/levels/" + user_level._id).status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.update = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user_level = await UserLeveL.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!user_level) return res.status(UserLevelMessages.error.e0.http).send(UserLevelMessages.error.e0);

        let message = UserLevelMessages.success.s1;
        message.body = user_level;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.delete = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await UserLeveL.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(UserLevelMessages.error.e0.http).send(UserLevelMessages.error.e0);

        return res.status(UserLevelMessages.success.s3.http).send(UserLevelMessages.success.s3);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}