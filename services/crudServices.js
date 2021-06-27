const Asset = require('../models/Asset');
const errorMapper = require('../helpers/errorMapper');

module.exports = {
    getAllByQuery,
    getOne,
    create,
    edit,
    getNotLeanOne,
    checkCanDo,
    getAllGuest,
    getAllWithProjection
}

//CREATE ASSET
async function create(data) {
    if (data.name) {
        const isAsset = await Asset.findAsset('name', data.name);
        // console.log('>Checking ', data.title, isAsset);
        if (isAsset != null) throw errorMapper.set('Hotel already exist!');
    }

    const asset = new Asset(data);
    return asset.save();
}

// GET ALL ASSET WITH SEARCH
async function getAllByQuery(query) {
    let q = {};
    if (query) {
        q = { title: new RegExp(query, 'i') };
    }
    return Asset.find(q).sort({ freeRooms: -1 }).lean();
}

//GET ALL FOR GUEST PAGE WITH LIMIT
async function getAllGuest() {
    return Asset.find({}).sort({ enrolledUsers: -1 }).limit(3).lean();
}

// GET ASSET LEAN
async function getOne(id) {
    const asset = await Asset.findById(id).lean();
    errorMapper.isExist(asset);
    return asset;
}

//EDIT ASSET 
async function edit(data, id) {
    const asset = await Asset.findById(id);
    errorMapper.isExist(asset);
    Object.assign(asset, data);
    return asset.save();
}

//GET ONE ASSET
async function getNotLeanOne(id) {
    const asset = await Asset.findById(id);
    errorMapper.isExist(asset);
    return asset;
}

//CHECK IF USER EXIST IN ARRAY
async function checkCanDo(id, userId) {
    const asset = await Asset.findOne({ _id: id, bookedUsers: { $nin: userId } });
    errorMapper.isExist(asset);
    return asset;
}

//GET ALL WITH QUERY AND PROJECTION LEAN
async function getAllWithProjection(...query) {
    return Asset.find(...query).lean();
}