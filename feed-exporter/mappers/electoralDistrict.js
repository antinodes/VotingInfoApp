/**
 * Created by rcartier13 on 3/4/14.
 */
var logger = (require('../../logging/vip-winston')).Logger;
var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function electoralDistrictExport(feedId, callback) {
  logger.info('Export Electoral Districts Started');
  schemas.models.electoraldistricts.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('electoral_district', 'id', _.escape(result.elementId.toString()));

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.type)
        chunk += util.startEndElement('type', _.escape(result.type));
      if(result.number)
        chunk += util.startEndElement('number', _.escape(result.number));

      chunk += util.endElement('electoral_district');
      callback(pd.xml(chunk));
    });

    logger.info('Export Electoral Districts Finished');
    logger.info('----------------------------');
  });
}

exports.electoralDistrictExport = electoralDistrictExport;