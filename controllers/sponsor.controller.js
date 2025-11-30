const Sponsor = require('../models/sponsor.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");

exports.get = async (req, res) => {
    try {
        const sponsors = await Sponsor.find(req.query);
        let message = SponsorMessages.success.s2;

        if (sponsors.length < 0)
            message = SponsorMessages.success.s5;

        message.body = sponsors;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
            const sponsor = await new Sponsor({
            name: req.body.name,
            level: req.body.level,
            contributions: req.body.contributions
        }).save();
        
        let message = SponsorMessages.success.s0;
        message.body = sponsor;
        return res.header("location", "/sponsors/" + sponsor._id).status(message.http).send(message);
    } catch (error) {
        throw error;
    }

}

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const sponsor = await Sponsor.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);

        let message = SponsorMessages.success.s1;
        message.body = sponsor;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }
}

exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await Sponsor.deleteOne({
            _id: req.params.id
        });
        
        if (result.deletedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);

        return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);
    } catch (error) {
        throw error;
    }
}

exports.getOne = async (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const sponsor = await Sponsor.findOne({
            _id: req.params.id
        });
        
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        let message = SponsorMessages.success.s2;
        message.body = sponsor;
        return res.status(message.http).send(message);
    } catch (error) {
        throw error;
    }

}

