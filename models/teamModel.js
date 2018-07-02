const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const teamSchema = new Schema({
  name:
      {
        type: String,
        required: true,
        unique: true
      },
  pot:
      {
        type: String,
        required: true,
      },
  group:
      {
        type: String,
        default: 'none'
      }
});

module.exports = mongoose.model('Team', teamSchema);
