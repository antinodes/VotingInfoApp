var util = require('./util.js');
var overviewQuery = "select r.id, \
                     xtv_state.value as state_name, \
                     xtv_type.value as election_type, \
                     xtv_date.value as election_date \
                     from results r \
                     left join xml_tree_values xtv_state on xtv_state.results_id = r.id \
                                           and xtv_state.simple_path = 'VipObject.State.Name' \
                     left join xml_tree_values xtv_type on xtv_type.results_id = r.id \
                                           and xtv_type.path ~ 'VipObject.*.Election.*.ElectionType.*.Text.0' \
                     left join xml_tree_values xtv_date on xtv_date.results_id = r.id \
                                           and xtv_date.simple_path = 'VipObject.Election.Date' \
                     where r.public_id = $1;"

var totalErrorsQuery = "select (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity in ('fatal', 'critical', 'errors')) as total_errors, \
                               (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity = 'warnings') as total_warnings \
                        from results r where r.public_id = $1;"
module.exports = {
  feedOverview: util.simpleQueryResponder(overviewQuery, util.paramExtractor()),
  totalErrors: util.simpleQueryResponder(totalErrorsQuery, util.paramExtractor()),
}
