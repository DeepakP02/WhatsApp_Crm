export const successResponse = (res, data, message = null, statusCode = 200) => {
    const response = { success: true, data };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
};

export const errorResponse = (res, error, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        error,
        code: statusCode
    });
};

export const paginatedResponse = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};
