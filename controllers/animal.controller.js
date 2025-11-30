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
        return res.status(500).send({ error: error.message });
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
        return res.status(500).send({ error: error.message });
    }
}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        // Process request body to handle date conversion for comments
        const updateData = { ...req.body };
        
        // If comments are being updated, ensure dates are properly formatted
        if (updateData.comments && Array.isArray(updateData.comments)) {
            updateData.comments = updateData.comments.map(comment => {
                if (comment.date && typeof comment.date === 'string') {
                    // Try to parse the date string
                    const parsedDate = new Date(comment.date);
                    // If date is invalid, use current date as fallback
                    if (isNaN(parsedDate.getTime())) {
                        comment.date = new Date();
                    } else {
                        comment.date = parsedDate;
                    }
                } else if (!comment.date) {
                    // If no date provided, use current date
                    comment.date = new Date();
                }
                return comment;
            });
        }
        
        const animal = await Animal.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: updateData
        }, {
            new: true
        });
        
        if (!animal) return res.status(AnimalMessages.error.e0.http).send(AnimalMessages.error.e0);

        let message = AnimalMessages.success.s1;
        message.body = animal;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
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
        return res.status(500).send({ error: error.message });
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
        return res.status(500).send({ error: error.message });
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
        return res.status(500).send({ error: error.message });
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
        return res.status(500).send({ error: error.message });
    }
}