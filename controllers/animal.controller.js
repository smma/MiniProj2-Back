const Animal = require('../models/animal.model');
const {
    validationResult
} = require('express-validator');
const AnimalMessages = require("../messages/animal.messages");

exports.get = async (req, res) => {

    try {
        const animals = await Animal.find(req.query).populate("comments.user", "name").exec();

        let message = AnimalMessages.success.s2;

        if (animals.length < 0)
            message = AnimalMessages.success.s5;

        message.body = animals;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }

}

exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const animal = await new Animal({
            name: req.body.name,
            group: req.body.group,
            description: req.body.description,
            level: req.body.level,
            links: req.body.links
        }).save();
        
        let message = AnimalMessages.success.s0;
        message.body = animal;
        return res.header("location", "/animals/" + animal._id).status(message.http).send(message);
    } catch (error) {
        throw error;
    }
}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const animal = await Animal.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!animal) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);

        let message = AnimalMessages.success.s1;
        message.body = animal;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }
}

exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Animal.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);
        return res.status(AnimalMessages.success.s3.http).send(AnimalMessages.success.s3);
    } catch (error) {
        throw error;
    }
}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const animal = await Animal.findOne({
            _id: req.params.id
        }).populate("comments.user", "name").exec();
        
        if (!animal) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);
        let message = AnimalMessages.success.s2;
        message.body = animal;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }

}

exports.activate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Animal.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: true
            }
        });

        if (result.n <= 0) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);
        return res.status(AnimalMessages.success.s6.http).send(AnimalMessages.success.s6);
    } catch (error) {
        throw error;
    }
}

exports.deactivate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Animal.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: false
            }
        });

        if (result.n <= 0) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);
        return res.status(AnimalMessages.success.s4.http).send(AnimalMessages.success.s4);
    } catch (error) {
        throw error;
    }
}