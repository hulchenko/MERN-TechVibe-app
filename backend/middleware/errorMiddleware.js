const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; //Mongoose returns 200 for "Cast to ObjectId failed" error
    let message = err.message;

    // Modify if the message is Mongoose non-existing ObjectId error:
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = 404; //500 by default
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? 'Hidden' : err.stack,
    });
};

export { notFound, errorHandler };