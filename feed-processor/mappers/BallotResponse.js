/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  BallotResponse = function (models, feedId) {
    basemapper.call(this, models, feedId, models.ballotresponses);
  };
util.inherits(BallotResponse, basemapper);

BallotResponse.prototype.mapXml3_0 = function (ballotResponse) {
  this.model = new this.models.ballotresponses({
    elementId: ballotResponse.$.id,     //required
    text: ballotResponse.text,
    sortOrder: ballotResponse.sort_order,
    _feed: this.feedId
  });
};

BallotResponse.prototype.mapXml5_0 = function (ballotResponse) {
  this.version = "v5";

  this.mapXml3_0(ballotResponse);
};

BallotResponse.prototype.mapCsv = function (ballotResponse) {
  this.model = new this.models.ballotresponses({
    elementId: ballotResponse.id,     //required
    text: ballotResponse.text,
    sortOrder: ballotResponse.sort_order,
    _feed: this.feedId
  });
};


module.exports = BallotResponse;