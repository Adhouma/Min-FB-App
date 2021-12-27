const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * mongoose-unique-validator is a plugin which adds pre-save validation 
 * for unique fields within a Mongoose schema.
 */
userSchema.plugin(uniqueValidator);

module.exports =  mongoose.model("User", userSchema);