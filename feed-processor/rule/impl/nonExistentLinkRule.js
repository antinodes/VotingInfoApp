/**
 * Created by rcartier13 on 5/19/14.
 */


var mongoose = require('mongoose');
var when = require('when');
var _ = require('underscore');

var nonExistentLinkRule = function(feedId, constraintSet, ruleDefinition, callback) {

  var model = mongoose.model(constraintSet.entity[0]);
  var totalErrors = 0;
  var promise = null;
  var searchResults = {};
  searchResults[constraintSet.fields[0]] = 1;
  searchResults[constraintSet.fields[1]] = 1;
  searchResults['_id'] = 1;
  searchResults['elementId'] = 1;

  var stream;
  if(constraintSet.entity[0] != 'states') {
    if(constraintSet.entity[0] == 'precincts')
      searchResults['mailOnly'] = 1;
    stream = model.find({ _feed: feedId }, searchResults).populate(constraintSet.fields[1]).stream();
  }
  else {
    stream = model.find({ _feed: feedId }, searchResults).stream();
  }

  stream.on('data', function(doc) {

    if(constraintSet.entity[0] == 'precincts') {
      if(doc.mailOnly) {
        return;
      }
    }

    if(!doc._doc[constraintSet.fields[0]])
      return;

    var newProm;
    if(_.isString(doc._doc[constraintSet.fields[0]])) {
      newProm = checkSingle(doc._doc, constraintSet, ruleDefinition, feedId);
    }
    else {
      if(doc._doc[constraintSet.fields[0]].length)
        newProm = checkArray(doc._doc, constraintSet, ruleDefinition, feedId);
    }

    if(newProm) {
      ++totalErrors;
      promise = promise ? when.join(promise, newProm) : newProm;
    }

  });

  stream.on('close', function(err) {
    if(promise) {
      promise.then(function () {
        callback({ promisedErrorCount: totalErrors });
      });
    }
    else {
      callback({ promisedErrorCount: 0 });
    }
  });

  stream.on('err', function(err) {
    logger.error(err);
  });
};

function checkSingle(doc, constraintSet, ruleDefinition, feedId) {
  if(doc[constraintSet.fields[0]] && !doc[constraintSet.fields[1]]) {
    return createError(constraintSet, ruleDefinition, feedId, doc[constraintSet.fields[0]], doc.elementId, doc._id);
  }

  return null;
}

function checkArray(doc, constraintSet, ruleDefinition, feedId) {

  if( !doc[constraintSet.fields[0]] )
    return null;

  var promise = null;
  for(var i = 0; i < doc[constraintSet.fields[0]].length; ++i) {
    var id = doc[constraintSet.fields[0]][i];
    var links = doc[constraintSet.fields[1]];
    var hasLink = false;
    if(links && links[i]) {
      if(links[i].elementId != id) {

        links.forEach(function(testLink) {
          if(id == testLink.elementId)
            hasLink = true;
        });
      }
      else { hasLink = true; }
    }

    if(id && !hasLink) {
      var newProm = createError(constraintSet, ruleDefinition, feedId, id, doc.elementId, doc._id);

      if(newProm) {
        promise = promise ? when.join(promise, newProm) : newProm;
      }
    }
  }

  return promise;
}

function createError(constraintSet, ruleDefinition, feedId, badId, elementId, _id) {
  var errorModel =  mongoose.model(constraintSet.entity[0].substring(0, constraintSet.entity[0].length-1) + 'errors');
  var newProm = errorModel.create({
    severityCode: ruleDefinition.severityCode,
    severityText: ruleDefinition.severityText,
    errorCode: ruleDefinition.errorCode,
    title: ruleDefinition.title,
    details: "Link to ID: " + badId + " does not exist",
    textualReference: "elementId: " + elementId,
    refElementId: elementId,
    _ref: _id,
    _feed: feedId
  });

  return newProm;
}

exports.evaluate = nonExistentLinkRule;