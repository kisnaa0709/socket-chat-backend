const { responseHandler } = require("../middlewares/responseHandler");


const defaults = {
    'abortEarly': false, // include all errors
    'allowUnknown': true, // ignore unknown props
    'stripUnknown': true // remove unknown props
};

const validatePost = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, defaults);
        if (error) {
            return responseHandler(error, res, error.message, 422);
        }
        req.value = value;
        next();
    };
};

const validateParams = (schema) => {
    return (req, res, next) => {
        console.log("🚀 ~ return ~ req:", req.params)
        const { error, value } = schema.validate(req.params, defaults);
        if (error) {
            return responseHandler(error, res, error.message, 422);
        }
        req.params = value;
        next();
    };
};

const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, defaults);
        if (error) {
            return responseHandler(error, res, error.message, 422);
        }
        req.value = value;
        next();
    };
};

module.exports = { validatePost, validateParams, validateQuery };