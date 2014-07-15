/**
 * Created by rcartier13 on 2/11/14.
 */

var logger = (require('../../logging/vip-winston')).Logger;
var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function kickoffResults(feedId, createOverviewModel, wait) {
  logger.info('=======================================');
  logger.info('Starting Results Calc...');
  resultsCalc(feedId, function(resultsOverview) {
    logger.info('Finished Results');
    logger.info('=======================================');
    createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResults, resultsOverview.ballotLineResults.errorCount, -3, feedId);
    createOverviewModel('Contest Results', resultsOverview.contestResults, resultsOverview.contestResults.errorCount, -3, feedId);
    wait();
  });
}

function resultsCalc(feedId, saveCalc) {
  var resultsOverview = { };
  var paramsList = [];

  paramsList.push(util.createParamList(feedId, 0, schemas.models.contestresults, function(res, cb) {
    resultsOverview.contestResults = res;
    schemas.models.contestresults.Error.count({_feed: feedId}, function(err, count) {
      resultsOverview.contestResults.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.ballotlineresults, function(res, cb) {
    resultsOverview.ballotLineResults = res;
    schemas.models.ballotlineresults.Error.count({_feed: feedId}, function(err, count) {
      resultsOverview.ballotLineResults.errorCount = count;
      cb();
    });
  }));

  async.eachSeries(paramsList, function(params, done) {
    var stream = util.streamOverviewObject(params);
    var overview = util.createOverviewObject();
    stream.on('data', function(doc) {
      overview.amount++;
      overview.fieldCount += util.countProperties(doc);
      overview.schemaFieldCount += params.model.fieldCount;
    });

    stream.on('end', function(err) {
      params.returnTotal(overview, done);
    });

  }, function() { saveCalc(resultsOverview); });
}

exports.kickoffResults = kickoffResults;
exports.resultsCalc = resultsCalc;