var mongoose = require("mongoose");
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// virtual for authors's full name
AuthorSchema.virtual("name").get(function () {
  // to avoid errs in cases where an author does not have either a family name or first name
  // we want to make sure we handle the exception by returning an empty string for that case
  var fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  const birth_formatted = DateTime.fromJSDate(
    this.date_of_birth
  ).toLocaleString(DateTime.DATE_MED);
  const death_formatted = DateTime.fromJSDate(
    this.date_of_birth
  ).toLocaleString(DateTime.DATE_MED);

  var lifetime_string = "";

  this.date_of_birth == undefined
    ? (lifetime_string += "???")
    : (lifetime_string += birth_formatted);

  lifetime_string += " - ";
  
  this.date_of_death == undefined
  ? (lifetime_string += "???")
  : (lifetime_string += birth_formatted);

  
  return lifetime_string;
});

// virtual for author's url
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// export model
module.exports = mongoose.model("Author", AuthorSchema);
