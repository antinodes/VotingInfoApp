
/*
 define rule using the below format:
 { name : '<rule_name>', condition : <rule_evaluation_function>, description: <rule_description> }
 */

var constraints = require('./dataconstraints');

var metisRuleList = [

  {
    ruleId: 'uniqueId',
    title: 'Url format must be valid',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 1,
    errorText: 'Url must conform to the format: http[?s]://<domain>.<org>',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/validUrlRule',
    dataConstraints: constraints['validUrl']
  },
  {
    ruleId: 'localityTypes',
    title: 'Invalid Locality Type',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 2,
    errorText: "Valid Locality types: 'county','city','town','township','borough','parish','village','region'",
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/localitytyperule',
    dataConstraints: constraints['localityType']
  },
  {
    ruleId: 'uniqueIdCheck',
    title: 'Top-level Metis element IDs must be unique',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 3,
    errorText: 'Top-level Metis element IDs must be unique',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/uniqueIdRule',
    dataConstraints: constraints['uniqueIdCheck']
  },
  {
    ruleId: 'streetSegmentOverlap',
    title: 'Street Segment ranges cannot overlap',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 4,
    errorText: 'Street Segment ranges cannot overlap',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['streetSegmentOverlap']
  },
  /* address direction range */
  {

    ruleId: 'addressDirection',
    title: 'Address Direction Invalid',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: true,
    errorCode: 5,
    errorText: 'Address Direction Invalid',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/addressDirectionRule',
    dataConstraints: constraints['addressDirection']
  },
  /* email format */
  {
    ruleId: 'emailFormatRule',
    title: 'Invalid email address format provided',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 6,
    errorText: 'Invalid email address format provided. Expected <username>@<domain>',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/emailFormatRule',
    dataConstraints: constraints['emailFormat']
  },
  /* phone number format */
  {
    ruleId: 'phoneNumberRule',
    title: 'Invalid phone number provided.',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 7,
    errorText: 'Invalid phone number provided.  Expected format / d[2-9]dd-ddd-ddd / i.e.- 864-478-5239',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/phoneNumberRule',
    dataConstraints: constraints['phoneNumberFormat']
  },
  /* address direction range */
  /* valid url format */
  /* zip code format */
  {
    ruleId: 'zipCodeRule',
    title: 'Invalid zip code format provided',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 8,
    errorText: 'Invalid zip code format provided.  Expected format / ddddd-dddd / i.e.- 95239-7839 or 91210',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/zipCodeRule',
    dataConstraints: constraints['zipCodeFormat']
  }
  /* locality type range */


];

module.exports = metisRuleList;
