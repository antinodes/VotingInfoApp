/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Locality = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Locality);
  };
util.inherits(Locality, basemapper);

Locality.prototype.mapXml3_0 = function (locality) {
  this.model = new this.models.Locality({
    elementId: this.convertId(locality.$.id),     //required
    name: locality.name,
    stateId: this.convertId(locality.state_id),
    type: locality.type,
    electionAdminId: this.convertId(locality.election_administration_id),
    earlyVoteSiteIds: this.convertId(locality.early_vote_site_id),
    _feed: this.feedId
  });
};

Locality.prototype.mapXml5_0 = function (locality) {
  this.model = new this.models.Locality({
    elementId: this.convertId(locality.$.id),     //required
    name: locality.name,
    stateId: this.convertId(locality.state_id),
    type: locality.type,
    electionAdminId: this.convertId(locality.election_administration_id),
    earlyVoteSiteIds: this.convertId(locality.early_vote_site_id),
    parentId: this.convertId(locality.parent_id),
    pollbookType: locality.pollbook_type,
    _feed: this.feedId
  });
};

Locality.prototype.mapCsv = function (locality) {
  this.model = new this.models.Locality({
    elementId: locality.id,     //required
    name: locality.name,
    stateId: locality.state_id,
    type: locality.type,
    electionAdminId: locality.election_administration_id,
    earlyVoteSiteIds: locality.early_vote_site_id,
    _feed: this.feedId
  });
};


module.exports = Locality;
