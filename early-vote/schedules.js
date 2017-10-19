var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//list schedules for election
var listSql = "select * from schedules where election_id = $1 order by start_date, start_time;";
var listHandler =
  util.simpleQueryResponder(listSql, util.pathParamExtractor(['electionid']));

//retrieve schedule by id
var getSql = "select * from schedules where id = $1";
var getHandler = util.simpleQueryResponder(getSql,
                                           util.pathParamExtractor(['scheduleid']));

//create schedule
var createSql = "INSERT into schedules(election_id, id, start_date, end_date, " +
  "start_time, end_time) values ($1, $2, $3, $4, $5, $6);"

var createParamsFn =
  util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
                               util.uuidGenerator(),
                               util.bodyParamExtractor(['start_date','end_date',
                                                        'start_time','end_time'])]);
var createHandler =
  util.simpleCommandResponder(createSql, createParamsFn);

//update schedule, updates all values so values that remain constant
//must still be passed in, values that are not present will be set to null
var updateSql = "UPDATE schedules SET start_date = $1, end_date = $2, " +
  "start_time = $3, end_time = $4 WHERE id = $5;"

var updateParamsFn =
  util.compoundParamExtractor([util.bodyParamExtractor(['start_date','end_date',
                                                        'start_time','end_time']),
                                util.pathParamExtractor(['scheduleid'])]);
var updateHandler =
  util.simpleCommandResponder(updateSql, updateParamsFn);

//delete schedule
var deleteSql = "delete from schedules where id = $1;"
var deleteHandler = util.simpleCommandResponder(deleteSql,
                                                util.pathParamExtractor(['scheduleid']));

function registerScheduleServices (app) {
  app.post('/earlyvote/elections/:electionid/schedules', createHandler);
  app.get('/earlyvote/elections/:electionid/schedules', listHandler);
  app.get('/earlyvote/schedules/:scheduleid', getHandler);
  app.delete('/earlyvote/schedules/:scheduleid', deleteHandler);
  app.put('/earlyvote/schedules/:scheduleid', updateHandler);
}

exports.registerScheduleServices = registerScheduleServices;