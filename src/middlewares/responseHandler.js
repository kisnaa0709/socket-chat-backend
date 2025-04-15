const responseHandler = (
    data,          // 'data' can be any type
    res,      // 'res' is an Express Response object
    message = 'Success',   // Default message is 'Success'
    status = 200          // Default status code is 200
) => {
    const statusCode = status;
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data
    });
};

const errorHandler = (
    res,      // 'res' is an Expres object
    message = 'Something went wrong !!',   // Default message is 'Something went wrong !!'
    status = 400          // Default status code is 400
) => {
    const statusCode = status;
    res.status(statusCode).json({
        status: statusCode,
        message: message
    });
};

module.exports = { responseHandler, errorHandler };