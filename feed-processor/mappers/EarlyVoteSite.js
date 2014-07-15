/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  EarlyVoteSite = function (models, feedId) {
    basemapper.call(this, models, feedId, models.earlyvotesites);
  };
util.inherits(EarlyVoteSite, basemapper);

EarlyVoteSite.prototype.mapXml3_0 = function (earlyVoteSite) {
  this.model = new this.models.earlyvotesites({
    elementId: earlyVoteSite.$.id,     //required
    name: earlyVoteSite.name,
    address: this.mapSimpleAddress(earlyVoteSite.address),
    directions: earlyVoteSite.directions,
    voterServices: earlyVoteSite.voter_services,
    startDate: earlyVoteSite.start_date,
    endDate: earlyVoteSite.end_date,
    daysTimesOpen: earlyVoteSite.days_times_open,
    _feed: this.feedId
  });
};

EarlyVoteSite.prototype.mapXml5_0 = function (earlyVoteSite) {
  this.version = "v5";

  this.model = new this.models.earlyvotesites({
    elementId: earlyVoteSite.$.id,     //required
    name: earlyVoteSite.name,
    address: this.mapSimpleAddress(earlyVoteSite.address),
    directions: earlyVoteSite.directions,
    voterServices: earlyVoteSite.voter_services,
    startDate: earlyVoteSite.start_date,
    endDate: earlyVoteSite.end_date,
    daysTimesOpen: earlyVoteSite.days_times_open,
    _feed: this.feedId
  });
};

EarlyVoteSite.prototype.mapCsv = function (earlyVoteSite) {
  this.model = new this.models.earlyvotesites({
    elementId: earlyVoteSite.id,     //required
    name: earlyVoteSite.name,
    address: {
      locationName: earlyVoteSite.address_location_name,
      line1: earlyVoteSite.address_line1,
      line2: earlyVoteSite.address_line2,
      line3: earlyVoteSite.address_line3,
      city: earlyVoteSite.address_city,
      state: earlyVoteSite.address_state,
      zip: earlyVoteSite.address_zip
    },
    directions: earlyVoteSite.directions,
    voterServices: earlyVoteSite.voter_services,
    startDate: earlyVoteSite.start_date,
    endDate: earlyVoteSite.end_date,
    daysTimesOpen: earlyVoteSite.days_times_open,
    _feed: this.feedId
  });
};


module.exports = EarlyVoteSite;