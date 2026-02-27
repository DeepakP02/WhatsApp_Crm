export const getPaginationOptions = (page = 1, limit = 20) => {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    return { take, skip };
};
