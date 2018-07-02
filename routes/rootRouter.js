// Routes to upload data

const express = require('express'),
       _ = require('underscore');

// format data to be stored in mongo
const formatData = function(jsonData) {
  let data = [], flatData, finalData;
  for(let key in jsonData) {
    data.push(jsonData[key]);
    for(let i = 0; i < jsonData[key].length; i++) {
      jsonData[key][i].pot = key;
    }
  }
  flatData = _.flatten(data);
  finalData = _.map(flatData, function(elem) {
    return _.omit(elem, 'id')
  });

  return finalData;
};

const rootRoutes = function(Team) {

  const rootRouter = express.Router();

  rootRouter.route('/upload')
    .post(function(req, res, next) {
        // Clean up database
        Team.remove().exec();

        if (_.isEmpty(req.body)) {
          err = new Error('No files were uploaded.');
          err.status = 400;
          return next(err);
        } else {
          let dataToSave = formatData(req.body);
          Team.insertMany(dataToSave, function(err, results) {
            if(err) return next(err);
            else res.status(201).json("Data uploaded successfully.");
          });
        }        
      });

return rootRouter;

}

module.exports = rootRoutes;
