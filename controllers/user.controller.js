const User = require('../models/user.model');
const {
    validationResult
} = require('express-validator');
const UserMessages = require("../messages/user.messages");
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/config");
const Animal = require("../models/animal.model");

exports.get = async (req, res) => {

    try {
        const users = await User.find(req.query);

        let message = UserMessages.success.s2;

        if (users.length === 0)
            message = UserMessages.success.s5;

        message.body = users;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user = await User.findOne({
            _id: req.params.id
        });
        
        if (!user) return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);
        let message = UserMessages.success.s2;
        message.body = user;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const existingUser = await User.findOne({
            "auth.username": req.body.auth.username
        });
        
        if (existingUser) return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);

        const user = await new User({
            name: req.body.name,
            type: req.body.type,
            birth_date: req.body.birth_date,
            description: req.body.description,
            location: {
                city: req.body.location.city,
                district: req.body.location.district,
                country: req.body.location.country
            },
            auth: {
                username: req.body.auth.username,
                password: req.body.auth.password
            }
        }).save();

        let payload = {
            pk: user.auth.public_key
        }

        let options = {
            expiresIn: CONFIG.auth.expiration_time,
            issuer: CONFIG.auth.issuer
        };

        let token = JWT.sign(payload, user.auth.private_key, options);

        let message = UserMessages.success.s0;
        message.body = user;
        return res.header("location", "/users/" + user._id).header("Authorization", token).status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.update = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user = await User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!user) return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);

        let message = UserMessages.success.s1;
        message.body = user;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.delete = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await User.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);

        await Animal.updateMany({}, {
            $pull: {
                comments: {
                    user: req.params.id
                }
            }
        });
        
        return res.status(UserMessages.success.s3.http).send(UserMessages.success.s3);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.activate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await User.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: true
            }
        });

        if (result.n <= 0) return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);
        return res.status(UserMessages.success.s6.http).send(UserMessages.success.s6);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.deactivate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await User.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: false
            }
        });

        if (result.n <= 0) return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);
        return res.status(UserMessages.success.s4.http).send(UserMessages.success.s4);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}