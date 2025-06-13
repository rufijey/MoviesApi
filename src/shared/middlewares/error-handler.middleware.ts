import { Request, Response, NextFunction } from 'express';

export function errorHandlerMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
}
