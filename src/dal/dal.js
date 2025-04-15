const mongoose = require("mongoose");

exports.create = async (model, body) => {
  return await model.create(body);
};

exports.find = async (
  model,
  filter = {},
  pagination = {},
  sort = {},
  projection = {}
) => {
  return await model
    .find(filter, projection)
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);
};

exports.findOne = async (model, filter, projection = {}) => {
  return await model.findOne(filter, projection);
};

exports.findOneAndUpdate = async (model, filter, body) => {
  return await model.findOneAndUpdate(filter, body, { new: true });
};

exports.findOneAndUpsert = async (model, filter, body) => {
  return await model.findOneAndUpdate(filter, body, {
    new: true,
    upsert: true,
    runValidators: true,
    context: "query",
    setDefaultsOnInsert: true,
  });
};

exports.updateMany = async (model, filter, body) => {
  return await model.updateMany(filter, body, { new: true });
};

exports.deleteMany = async (model, filter) => {
  return await model.deleteMany(filter);
};

exports.aggregate = async (model, query) => {
  return await model
    .aggregate(query)
    .collation({ locale: "en_US", strength: 1 });
};

exports.findOneAndDelete = async (model, filter) => {
  return await model.findOneAndDelete(filter);
};

exports.hardDelete = async (model, id) => {
  return await model.findByIdAndDelete(id);
}; 