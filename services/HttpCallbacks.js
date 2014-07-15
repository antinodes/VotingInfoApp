/**
 * Created by rcartier13 on 1/14/14.
 */
var dao = require('../dao/db');
var mapper = require('./mappers/feed');
var _path = require('path');
var exporter = require('../feed-exporter/exporter');
var schemas = require('../dao/schemas');
var processManager = require('./processManager');
var feedIdMapper = require('../feedIdMapper');

/*
 * Error handling middleware
 */
function notFoundHandler (res, err, data, next) {
  if (data == null) {
    res.send(404);
  }
  else {
    next();
  }
};

/*
 * Post endpoint for starting the feed processing
 */
function feedProcessingPost (req, res) {
  processManager.handleFileProcessing(req, res);
};

/*
 * Callbacks for HTTP verbs
 */
function feedQueueGET (req, res) {
  res.json(
    mapper.mapFeedQueue()
  );
};

function allFeedsGET (req, res) {
  dao.getFeeds(function (err, data) {
    res.json(data.map(function (data) {
      return mapper.mapFeed(req.path, data);
    }));
  });
};

function feedOverviewGET (req, res) {

  dao.getFeedOverview(feedIdMapper.getId(req.params.feedid), function (err, feed) {
    notFoundHandler(res, err, feed, function () {
      res.json(mapper.mapFeedOverview(req.path, feed))
    });
  });

};

function feedSourceGET (req, res) {

  dao.getFeedSource(feedIdMapper.getId(req.params.feedid), function (err, source) {
    notFoundHandler(res, err, source, function () {
      res.json(mapper.mapSource(req.path, source));
    });
  });
};

function feedElectionGET (req, res) {

  dao.getFeedElection(feedIdMapper.getId(req.params.feedid), function (err, election) {
    notFoundHandler(res, err, election, function () {
      res.json(mapper.mapElection(req.path, election));
    });
  });
};

function feedElectionContestResultsGET (req, res) {

  dao.getFeedContestResults(feedIdMapper.getId(req.params.feedid), function (err, contestresults) {
    notFoundHandler(res, err, contestresults, function () {
      res.json(contestresults.map(function (data) {
        return mapper.mapResultsContestResults(req.path, data);
      }));
    });
  });
};

function feedElectionBallotLineResultsGET (req, res) {

  dao.getFeedBallotLineResults(feedIdMapper.getId(req.params.feedid), function (err, ballotlineresults) {
    notFoundHandler(res, err, ballotlineresults, function () {
      res.json(ballotlineresults.map(function (data) {
        return mapper.mapResultsBallotLineResults(req.path, data);
      }));
    });
  });
};

function feedStateGET (req, res) {

  dao.getState(feedIdMapper.getId(req.params.feedid), function (err, state) {
    notFoundHandler(res, err, state, function () {
      res.json(mapper.mapState(req.path, state));
    });
  });
};

function feedStateEarlyVoteSitesGET (req, res) {

  dao.getStateEarlyVoteSites(feedIdMapper.getId(req.params.feedid), function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function () {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedLocalityGET (req, res) {

  dao.getLocality(feedIdMapper.getId(req.params.feedid), req.params.localityid, function (err, locality) {
    notFoundHandler(res, err, locality, function () {
      res.json(mapper.mapLocality(req.path, locality));
    });
  });
};

function feedLocalitiesGET (req, res) {

  dao.getLocalities(feedIdMapper.getId(req.params.feedid), function (err, localities) {
    notFoundHandler(res, err, localities, function () {
      res.json(mapper.mapLocalities(req.path, localities));
    });
  });
};

function feedLocalityEarlyVoteSitesGET (req, res) {
  dao.getLocalityEarlyVoteSite(feedIdMapper.getId(req.params.feedid), req.params.localityid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function () {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedLocalityPrecinctsGET (req, res) {
  dao.getLocalityPrecincts(feedIdMapper.getId(req.params.feedid), req.params.localityid, function (err, precincts) {
    notFoundHandler(res, err, precincts, function () {
      res.json(mapper.mapLocalityPrecincts(req.path, precincts));
    });
  });
};

function feedPrecinctGET (req, res) {
  dao.getLocalityPrecinct(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, precinct) {
    notFoundHandler(res, err, precinct, function() {
      res.json(mapper.mapPrecinct(req.path, precinct));
    });
  });
};

function feedPrecinctEarlyVoteSitesGET (req, res) {
  dao.getLocalityPrecinctEarlyVoteSites(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function() {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedPrecinctElectoralDistrictsGET (req, res) {
  dao.getPrecinctElectoralDistricts(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, electoralDistricts) {
    notFoundHandler(res, err, electoralDistricts, function() {
      res.json(mapper.mapElectoralDistricts(req.path, electoralDistricts));
    });
  });
};

function feedPrecinctPollingLocationsGET (req, res) {
  dao.getPrecinctPollingLocations(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, pollingLocations) {
    notFoundHandler(res, err, pollingLocations, function() {
      res.json(mapper.mapPollingLocations(req.path, pollingLocations));
    });
  });
};

function feedPrecinctPollingLocationGET(req, res) {
  dao.getPollingLocation(feedIdMapper.getId(req.params.feedid), req.params.pollinglocationid, function (err, pollingLocation) {
    notFoundHandler(res, err, pollingLocation, function() {
      res.json(mapper.mapPollingLocation(req.path, pollingLocation));
    });
  });
};

function feedPrecinctPrecinctSplitsGET (req, res) {
  dao.getPrecinctPrecinctSplits(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, precinctSplits) {
    notFoundHandler(res, err, precinctSplits, function() {
      res.json(mapper.mapPrecinctPrecinctSplits(req.path, precinctSplits));
    });
  });
};

function feedPrecinctStreetSegmentsGET (req, res) {
  dao.getPrecinctStreetSegments(feedIdMapper.getId(req.params.feedid), req.params.precinctid, function (err, streetSegments) {
    notFoundHandler(res, err, streetSegments, function() {
      res.json(mapper.mapStreetSegments(req.path, streetSegments));
    });
  });
};

function feedElectionContestsGET (req, res) {
  dao.getFeedContests(feedIdMapper.getId(req.params.feedid), function (err, contests) {
    notFoundHandler(res, err, contests, function () {
      res.json(contests.map(function (data) {
        return mapper.mapElectionContest(req.path, data);
      }));
    });
  });
};

function feedPrecinctSplitGET (req, res) {
  dao.feedPrecinctSplit(feedIdMapper.getId(req.params.feedid), req.params.splitid, function (err, split) {
    notFoundHandler(res, err, split, function () {
      res.json(mapper.mapPrecinctSplit(req.path, split));
    });
  });
};

function feedPrecinctSplitElectoralDistrictsGET (req, res) {
  dao.feedPrecinctSplitElectoralDistricts(feedIdMapper.getId(req.params.feedid), req.params.splitid, function (err, electoralDistricts) {
    notFoundHandler(res, err, electoralDistricts, function () {
      res.json(mapper.mapElectoralDistricts(req.path, electoralDistricts));
    });
  });
};

function feedPrecinctSplitPollingLocationsGET (req, res) {
  dao.feedPrecinctSplitPollingLocations(feedIdMapper.getId(req.params.feedid), req.params.splitid, function (err, pollingLocations) {
    notFoundHandler(res, err, pollingLocations, function () {
      res.json(mapper.mapPollingLocations(req.path, pollingLocations));
    });
  });
};

function feedPrecinctSplitPollingLocationGET(req, res) {
  dao.getPollingLocation(feedIdMapper.getId(req.params.feedid), req.params.pollinglocationid, function (err, pollingLocation) {
    notFoundHandler(res, err, pollingLocation, function() {
      //Use ../.. to normalize the path so the same code can be used for Precinct Polling Locations
      // and Precinct Split Polling Locations
      res.json(mapper.mapPollingLocation(_path.join(req.path, '../..'), pollingLocation));
    });
  });
};

function feedPrecinctSplitStreetSegmentsGET (req, res) {
  dao.feedPrecinctSplitStreetSegments(feedIdMapper.getId(req.params.feedid), req.params.splitid, function (err, streetSegments) {
    notFoundHandler(res, err, streetSegments, function () {
      res.json(mapper.mapStreetSegments(req.path, streetSegments));
    });
  });
};

function feedEarlyVoteSiteGET (req, res) {
  dao.feedEarlyVoteSite (feedIdMapper.getId(req.params.feedid), req.params.evsid, function (err, earlyVoteSite) {
    notFoundHandler(res, err, earlyVoteSite, function () {
      res.json(mapper.mapEarlyVoteSite(req.path, earlyVoteSite));
    });
  });
};

function feedStateElectionAdministrationGET (req, res) {
  dao.feedStateElectionAdministration(feedIdMapper.getId(req.params.feedid), function (err, electionAdmin) {
    notFoundHandler(res, err, electionAdmin, function () {
      res.json(mapper.mapElectionAdministration(req.path, electionAdmin));
    });
  });
};

function feedLocalityElectionAdministrationGET (req, res) {
  dao.feedLocalityElectionAdministration(feedIdMapper.getId(req.params.feedid), req.params.localityid, function (err, electionAdmin) {
    notFoundHandler(res, err, electionAdmin, function () {
      res.json(mapper.mapElectionAdministration(req.path, electionAdmin));
    });
  });
};

function feedContestGET (req, res) {
  dao.feedContest(feedIdMapper.getId(req.params.feedid), req.params.contestid, function (err, contest) {
    notFoundHandler(res, err, contest, function () {
      res.json(mapper.mapContest(req.path, contest));
    });
  });
};

function feedContestElectoralDistrictGET (req, res) {
  dao.feedContestElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, electoralDistrict) {
    notFoundHandler(res, err, electoralDistrict, function () {
      res.json(mapper.mapElectoralDistrict(_path.join(req.path, '../..'), electoralDistrict));
    });
  });
};

function feedPrecinctElectoralDistrictGET(req, res) {
  dao.feedElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.districtid, function(err, electoralDistrict) {
    notFoundHandler(res, err, electoralDistrict, function () {
      res.json(
        mapper.mapElectoralDistrict(
          _path.join(req.path, '../../../../../../../contests'),
          electoralDistrict));
    });
  });
};

function feedPrecinctSplitElectoralDistrictGET(req, res) {
  dao.feedElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.districtid, function(err, electoralDistrict) {
    notFoundHandler(res, err, electoralDistrict, function () {
      res.json(
        mapper.mapElectoralDistrict(
          _path.join(req.path, '../../../../../../../../../contests'),
          electoralDistrict));
    });
  });
};

function feedContestBallotGET (req, res) {
  dao.feedContestBallot(feedIdMapper.getId(req.params.feedid), req.params.contestid, function (err, ballot) {
    notFoundHandler(res, err, ballot, function () {
      res.json(mapper.mapBallot(req.path, ballot));
    });
  });
};

function feedBallotCandidatesGET(req, res) {
  dao.feedBallotCandidates(feedIdMapper.getId(req.params.feedid), req.params.contestid, function (err, candidates) {
    notFoundHandler(res, err, candidates, function () {
      res.json(mapper.mapBallotCandidates(req.path, candidates));
    });
  });
};

function feedCandidateGET (req, res) {
  dao.feedCandidate(feedIdMapper.getId(req.params.feedid), req.params.candidateid, function(err, candidate) {
    notFoundHandler(res, err, candidate, function () {
      res.json(mapper.mapCandidate(req.path, candidate));
    });
  });
};

function feedBallotReferendaGET(req, res) {
  dao.feedBallotReferenda(feedIdMapper.getId(req.params.feedid), req.params.contestid, function (err, referenda) {
    notFoundHandler(res, err, referenda, function () {
      res.json(mapper.mapReferenda(req.path, referenda));
    });
  });
};

function feedBallotReferendumGET(req, res) {
  dao.feedBallotReferendum(feedIdMapper.getId(req.params.feedid), req.params.referendumid, function (err, referendum) {
    notFoundHandler(res, err, referendum, function () {
      res.json(mapper.mapReferendum(req.path, referendum));
    });
  });
};

function feedHistoryGET (req, res) {
  var history = {}; //TODO: get data from the database
  res.json(mapper.mapHistory(req.path, history));
};

function feedContestResultGET (req, res) {
  dao.getContestResult(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, contestResult) {
    notFoundHandler(res, err, contestResult, function () {
      res.json(mapper.mapContestResult(req.path, contestResult));
    });
  });
}

function feedContestBallotLineResultsGET (req, res) {
  dao.getContestBallotLineResults(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, results) {
    notFoundHandler(res, err, results, function() {
      res.json(mapper.mapBallotLineResults(req.path, results));
    });
  });
}

function feedBallotLineResultGET(req, res) {
  dao.getBallotLineResult(feedIdMapper.getId(req.params.feedid), req.params.blrid, function(err, blr) {
    notFoundHandler(res, err, blr, function() {
      res.json(mapper.mapBallotLineResult(req.path, blr));
    });
  });
}

function feedContestBallotStyleGET(req, res) {
  dao.getContestBallotStyles(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, ballotStyles) {
    notFoundHandler(res, err, ballotStyles, function() {
      res.json(mapper.mapBallotStyles(req.path, ballotStyles));
    })
  })
}

function feedCandidateBallotStyleGET(req, res) {
  dao.getCandidateBallotStyles(feedIdMapper.getId(req.params.feedid), req.params.candidateid, function(err, ballotStyles) {
    notFoundHandler(res, err, ballotStyles, function() {
      res.json(mapper.mapBallotStyles(req.path, ballotStyles));
    });
  });
}

function feedExportPOST(req, res) {
  // not converting the feedid, as we are passing in the mongo feedid
  exporter.createXml(req.params.feedid, req.body.feedName, req.body.feedFolder, exporter.Instance(), function(err, location) {
    if(err)
      res.send(400)
    else
      res.send(location);
  });
}

exports.feedProcessingPost = feedProcessingPost;
exports.feedQueueGET = feedQueueGET;
exports.allFeedsGET = allFeedsGET;
exports.feedOverviewGET = feedOverviewGET;
exports.feedSourceGET = feedSourceGET;
exports.feedElectionGET = feedElectionGET;
exports.feedElectionContestResultsGET = feedElectionContestResultsGET;
exports.feedStateGET = feedStateGET;
exports.feedStateEarlyVoteSitesGET = feedStateEarlyVoteSitesGET;
exports.feedLocalitiesGET = feedLocalitiesGET;
exports.feedLocalityGET = feedLocalityGET;
exports.feedLocalityEarlyVoteSitesGET = feedLocalityEarlyVoteSitesGET;
exports.feedLocalityPrecinctsGET = feedLocalityPrecinctsGET;
exports.feedPrecinctGET = feedPrecinctGET;
exports.feedPrecinctEarlyVoteSitesGET = feedPrecinctEarlyVoteSitesGET;
exports.feedPrecinctElectoralDistrictsGET = feedPrecinctElectoralDistrictsGET;
exports.feedPrecinctPollingLocationsGET = feedPrecinctPollingLocationsGET;
exports.feedPrecinctPollingLocationGET = feedPrecinctPollingLocationGET;
exports.feedPrecinctPrecinctSplitsGET = feedPrecinctPrecinctSplitsGET;
exports.feedPrecinctStreetSegmentsGET = feedPrecinctStreetSegmentsGET;
exports.feedPrecinctSplitGET = feedPrecinctSplitGET;
exports.feedPrecinctSplitElectoralDistrictsGET = feedPrecinctSplitElectoralDistrictsGET;
exports.feedPrecinctSplitPollingLocationsGET = feedPrecinctSplitPollingLocationsGET;
exports.feedPrecinctSplitPollingLocationGET = feedPrecinctSplitPollingLocationGET;
exports.feedPrecinctSplitStreetSegmentsGET = feedPrecinctSplitStreetSegmentsGET;
exports.feedEarlyVoteSiteGET = feedEarlyVoteSiteGET;
exports.feedElectionContestsGET = feedElectionContestsGET;
exports.feedElectionBallotLineResultsGET = feedElectionBallotLineResultsGET;
exports.feedStateElectionAdministrationGET = feedStateElectionAdministrationGET;
exports.feedLocalityElectionAdministrationGET = feedLocalityElectionAdministrationGET;
exports.feedContestGET = feedContestGET;
exports.feedContestElectoralDistrictGET = feedContestElectoralDistrictGET;
exports.feedPrecinctElectoralDistrictGET = feedPrecinctElectoralDistrictGET;
exports.feedPrecinctSplitElectoralDistrictGET = feedPrecinctSplitElectoralDistrictGET;
exports.feedContestBallotGET = feedContestBallotGET;
exports.feedBallotCandidatesGET = feedBallotCandidatesGET;
exports.feedHistoryGET = feedHistoryGET;
exports.feedContestResultGET = feedContestResultGET;
exports.feedBallotReferendaGET = feedBallotReferendaGET;
exports.feedBallotReferendumGET = feedBallotReferendumGET;
exports.feedCandidateGET = feedCandidateGET;
exports.feedContestBallotLineResultsGET = feedContestBallotLineResultsGET;
exports.feedBallotLineResultGET = feedBallotLineResultGET;
exports.feedContestBallotStyleGET = feedContestBallotStyleGET;
exports.feedCandidateBallotStyleGET = feedCandidateBallotStyleGET;

exports.feedExportPOST = feedExportPOST;

// adding profiling for all functions in this file
// that meet the certain criteria
var profileHelper = require('../logging/profile-helper');
profileHelper.profileAsyncJsonResponse("HttpCallbacks", this);