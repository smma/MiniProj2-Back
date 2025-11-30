const Quiz = require('../models/quiz.model');
const {
    validationResult
} = require('express-validator');
const QuizMessages = require("../messages/quiz.messages");

exports.get = async (req, res) => {

    try {
        const quizzes = await Quiz.find(req.query).populate("questions").exec();
        let message = QuizMessages.success.s2;

        if (quizzes.length === 0)
            message = QuizMessages.success.s5;

        message.body = quizzes;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const quiz = await new Quiz({
            name: req.body.name,
            points: req.body.points,
            level: req.body.level,
            questions: req.body.questions
        }).save();
        
        await quiz.populate("questions");
        let message = QuizMessages.success.s0;
        message.body = quiz;
        return res.header("location", "/quizzes/" + quiz._id).status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const quiz = await Quiz.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!quiz) return res.status(QuizMessages.error.e0.http).send(QuizMessages.error.e0);
        
        await quiz.populate("questions");
        let message = QuizMessages.success.s1;
        message.body = quiz;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Quiz.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(QuizMessages.error.e0.http).send(QuizMessages.error.e0);
        return res.status(QuizMessages.success.s3.http).send(QuizMessages.success.s3);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id
        }).populate("questions").exec();
        
        if (!quiz) return res.status(QuizMessages.error.e0.http).send(QuizMessages.error.e0);
        let message = QuizMessages.success.s2;
        message.body = quiz;
        return res.status(message.http).send(message);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

}

exports.activate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Quiz.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: true
            }
        });
        
        if (result.n <= 0) return res.status(QuizMessages.error.e0.http).send(QuizMessages.error.e0);
        return res.status(QuizMessages.success.s6.http).send(QuizMessages.success.s6);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.deactivate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Quiz.updateOne({
            _id: req.params.id
        }, {
            $set: {
                active: false
            }
        });
        
        if (result.n <= 0) return res.status(QuizMessages.error.e0.http).send(QuizMessages.error.e0);
        return res.status(QuizMessages.success.s4.http).send(QuizMessages.success.s4);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}