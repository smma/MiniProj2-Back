const Question = require('../models/question.model');
const {
    validationResult
} = require('express-validator');
const QuestionMessages = require("../messages/question.messages");
const Quiz = require("../models/quiz.model");

exports.get = async (req, res) => {
    try {
        const questions = await Question.find(req.query);
        let message = QuestionMessages.success.s2;

        if (questions.length === 0)
            message = QuestionMessages.success.s5;

        message.body = questions;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const question = await new Question({
            question: req.body.question,
            group: req.body.group,
            type: req.body.type,
            description: req.body.description,
            title: req.body.title,
            answers: req.body.answers,
            level: req.body.level
        }).save();
        
        let message = QuestionMessages.success.s0;
        message.body = question;
        return res.header("location", "/questions/" + question._id).status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const question = await Question.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!question) return res.status(QuestionMessages.error.e0.http).send(QuestionMessages.error.e0);

        let message = QuestionMessages.success.s1;
        message.body = question;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Question.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(QuestionMessages.error.e0.http).send(QuestionMessages.error.e0);

        await Quiz.updateMany({}, {
            $pull: {
                questions: req.params.id
            }
        });
        
        return res.status(QuestionMessages.success.s3.http).send(QuestionMessages.success.s3);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const question = await Question.findOne({
            _id: req.params.id
        });
        
        if (!question) return res.status(QuestionMessages.error.e0.http).send(QuestionMessages.error.e0);
        let message = QuestionMessages.success.s2;
        message.body = question;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.activate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Question.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: true
            }
        });

        if (result.n <= 0) return res.status(QuestionMessages.error.e0.http).send(QuestionMessages.error.e0);
        return res.status(QuestionMessages.success.s6.http).send(QuestionMessages.success.s6);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.deactivate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Question.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: false
            }
        });

        if (result.n <= 0) return res.status(QuestionMessages.error.e0.http).send(QuestionMessages.error.e0);
        return res.status(QuestionMessages.success.s4.http).send(QuestionMessages.success.s4);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}