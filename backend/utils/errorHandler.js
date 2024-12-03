class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err.message
        });
    }

    // Programming or unknown errors
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        error: 'Something went wrong!'
    });
};

module.exports = {
    AppError,
    handleError
};