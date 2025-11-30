const express = require('express');
let router = express.Router();
const UserController = require('../controllers/user.controller');
const {
    body,
    param
} = require('express-validator');
const CONFIG = require("../config/config");
const AuthController = require("../controllers/auth.controller");

router.route('/')
    .post([body('name').isString(),
        body('type').isAlpha(),
        body('birth_date').isISO8601(),
        body('description').isString(),
        body('location.city').isString(),
        body('location.district').isString(),
        body('location.country').isString(),
        body('auth.username').isAlphanumeric(),
        body('auth.password').isString(),
        body('name').whitelist(CONFIG.sanitize.alphabet),
        body('description').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        body('location.city').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        body('location.district').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        body('location.country').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical)
    ], UserController.create)
    .get(AuthController.checkAuth, UserController.get);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], UserController.deactivate);

router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], UserController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], UserController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()], UserController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], UserController.delete);

module.exports = router;