const express = require('express'),
       _ = require('underscore');

// utility for formatting names
const formatName = function(name) {
  let letter, word, finalName;
  name = name.toLowerCase();
  letter = name.charAt(0).toUpperCase();
  word = name.slice(1, name.length);
  finalName = letter.concat(word);

  return finalName;
}

const apiRoutes = function(Team) {

  const apiRouter = express.Router();

  // Middleware to check if data was provided to the API
  apiRouter.use('/', function(req, res, next) {
    Team.find({}, {'_id': 0, 'name': 1, 'group': 1, 'pot': 1 }, function(err, teams) {
      if(err) return next(err);
      else if(teams.length === 0) {
        err = new Error("No data was provided. Please upload file.");
        err.status = 400;
        return next(err);
      } else {
        req.teams = teams;
        return next();
      }
    });
  });

  // Handle errors for /groups route when draw wasn't performed
  apiRouter.use('/groups', function(req, res, next) {
    if(req.teams[0].group === 'none') {
      err = new Error("Please perform draw to form groups.");
      err.status = 400;
      return next(err);
    } else {
      return next();
    }
  });

  // parameter handler to preload doc and handle errors for :teamName
  apiRouter.param("teamName", function(req, res, next, name) {
    let formatedName = formatName(name);
    Team.findOne({name: formatedName}, function(err, team) {
      if(err) return next(err);
      else if(!team) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
      } else {
        req.team = team;
        return next();
      }
    });
  });

  // parameter handler to preload doc and handle errors for :groupName
  apiRouter.param("groupName", function(req, res, next, group) {
    let formatedGroup = formatName(group);
    Team.find({group: formatedGroup},{'_id': 0, 'name': 1, 'pot': 1 }, function(err, teams) {
      if(err) return next(err);
      if(teams.length === 0) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
      }
      req.teams = teams;
      return next();
    });
  });

  // parameter handler to preload doc and handle errors for :potName
  apiRouter.param("potName", function(req, res, next, pot) {
    let formatedPot = formatName(pot);
    Team.find({pot: formatedPot}, {'_id': 0, 'name': 1, 'group': 1 }, function(err, teams) {
      if(err) return next(err);
      if(teams.length === 0) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
      }
      req.teams = teams;
      return next();
    });
  });

  apiRouter.route('/draw')
    .get(function(req, res, next) {
      for(let i = 1; i <= 4; i++) {
        let groups = _.shuffle(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
        Team.find({pot: 'P' + i}, function(err, teams) {
          if(err) return next(err);
          else {
            _.map(teams, function(elem, index) {
            elem.group = groups[index];
            elem.save();
            });
          }
        });
      }
      res.status(200).json('Team draw completed succesfully.');
    });


  apiRouter.route('/teams')
    .get(function(req, res) {
      res.status(200).json(req.teams);
    });

  apiRouter.route('/teams/:teamName')
    .get(function(req, res) {
      res.status(200).json(req.team);
    })
    .put(function(req, res, next) {
      // allow updates only on name and pot fields
      let updates = {name: req.body.name || req.team.name, pot: req.body.pot  || req.team.pot};
      Team.findByIdAndUpdate(req.team._id, updates, {new: true}, function(err, result) {
        if(err) return next(err);
        else res.status(201).json(result);
      });
    })
    .delete(function(req, res, next) {
      Team.findByIdAndDelete(req.team._id, function(err, result) {
        if(err) return next(err);
        else res.status(204).json('Team deleted.');
      });
    });

  apiRouter.route('/groups')
    .get(function(req, res) {
      let groupsArr = _.sortBy(req.teams, 'group');
      res.status(200).json(_.groupBy(groupsArr, 'group'));
    });

  apiRouter.route('/groups/:groupName')
    .get(function(req, res) {
      res.status(200).json(req.teams);
    });

  apiRouter.route('/pots')
    .get(function(req, res) {
      let groupsArr = _.sortBy(req.teams, 'pot');
      res.status(200).json(_.groupBy(groupsArr, 'pot'));
    });

  apiRouter.route('/pots/:potName')
    .get(function(req, res) {
      res.status(200).json(req.teams);
    });

return apiRouter;

}

module.exports = apiRoutes;
