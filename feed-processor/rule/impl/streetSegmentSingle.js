/**
 * Created by rcartier13 on 3/24/14.
 */

var mongoose = require('mongoose');
var logger = (require('../../../logging/vip-winston')).Logger;


function evaluateStreetSegmentsOverlapSingle(_feedId, constraintSet, ruleDefinition, callback) {

  var Model = mongoose.model(constraintSet.entity[0]);

  Model.aggregate({ $match: { _feed: _feedId} }, {
      $group: {
        _id: {
          _feed: "$_feed",
          startHouseNumber: "$startHouseNumber",
          endHouseNumber: "$endHouseNumber",
          oddEvenBoth: "$oddEvenBoth",
          startApartmentNumber: "$startApartmentNumber",
          endApartmentNumber: "$endApartmentNumber",
          houseNumber: "$nonHouseAddress.houseNumber",
          houseNumberPrefix: "$nonHouseAddress.houseNumberPrefix",
          houseNumberSuffix: "$nonHouseAddress.houseNumberSuffix",
          streetDirection: "$nonHouseAddress.streetDirection",
          streetName: "$nonHouseAddress.streetName",
          streetSuffix: "$nonHouseAddress.streetSuffix",
          addressDirection: "$nonHouseAddress.addressDirection",
          apartment: "$nonHouseAddress.apartment",
          city: "$nonHouseAddress.city",
          state: "$nonHouseAddress.state",
          zip: "$nonHouseAddress.zip",
          precinctId: "$precinctId",
          precinctSplitId: "$precinctSplitId"
        },

        count: { $sum: 1 },
        id: { $push: "$_id" },
        elementId: { $push: "$elementId" }
      }
    },
    { $match: { count: { $gt : 1 } } }).exec(function(err, results) {
      if(err) {
        logger.error(err);
        return;
      }

      results.forEach(function(result) {
        var errorTexts = "{id: " + result.elementId[0] + "}{id: " + result.elementId[1] + "}";
        createError(constraintSet, result.elementId[0], result.id[0], _feedId, errorTexts, ruleDefinition);
      });
      callback({ promisedErrorCount: results.length });
    });
}

function createError(constraints, elementId, mongoId, feedId, error, rule) {
  var model =  mongoose.model(constraints.entity[0].substring(0, constraints.entity[0].length-1) + 'errors');
  return model.create({
    severityCode: rule.severityCode,
    severityText: rule.severityText,
    errorCode: rule.errorCode,
    title: rule.title,
    details: error,
    textualReference: 'id = ' + elementId + " (" + error + ")",
    refElementId: elementId,
    _ref: mongoId,
    _feed: feedId
  });
}

exports.evaluateStreetSegmentsOverlapSingle = evaluateStreetSegmentsOverlapSingle;