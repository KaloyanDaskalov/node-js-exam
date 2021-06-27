const { create, getAllByQuery, getOne, edit, getNotLeanOne, checkCanDo, getAllGuest, getAllWithProjection } = require('../services/crudServices');

module.exports = () => (req, res, next) => {
    req.store = {
        getAllByQuery,
        getOne,
        create,
        edit,
        getNotLeanOne,
        checkCanDo,
        getAllGuest,
        getAllWithProjection
    };
    next();
};