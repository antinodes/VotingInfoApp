/**
 * Created by nboseman on 1/29/14.
 */

var matcher = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))/;

var evaluateValidUrl = function(urlString, dataSet, entity, constraintSet, ruleDef, callback){
  var isViolated = false;


  if(urlString != null && urlString != ""){
    try {
      isViolated = !matcher.test(urlString.trim().toLowerCase());
    }
    catch(err){
      // doNothing
    }
  }

  callback( { isViolated: isViolated, dataItem: constraintSet + " = " + urlString, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
};

exports.evaluate = evaluateValidUrl;
