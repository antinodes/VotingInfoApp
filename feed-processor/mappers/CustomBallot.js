/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  CustomBallot = function (models, feedId) {
    basemapper.call(this, models, feedId, models.customballots);
  };
util.inherits(CustomBallot, basemapper);

CustomBallot.prototype.mapXml3_0 = function (customBallot) {
  this.model = new this.models.customballots({
    elementId: customBallot.$.id,     //required
    heading: customBallot.heading,
    ballotResponses: _.map(customBallot.ballot_response_id, function(response) {
      return {
        elementId: (response.$text === undefined) ? response : response.$text,
        sortOrder: (response.$ === undefined) ? undefined : response.$.sort_order
      };
    }),
    _feed: this.feedId
  });
};

CustomBallot.prototype.mapXml5_0 = function (customBallot) {
  this.version = "v5";

  this.mapXml3_0(customBallot);
};

CustomBallot.prototype.mapCsv = function (customBallot) {
  this.model = new this.models.customballots({
    elementId: customBallot.id,     //required
    heading: customBallot.heading,
    ballotResponses: _.map(customBallot.ballot_response_id, function(response) {
      return {
        elementId: (response.$text === undefined) ? response : response.$text,
        sortOrder: (response.$ === undefined) ? undefined : response.$.sort_order
      };
    }),
    _feed: this.feedId
  });
};


module.exports = CustomBallot;