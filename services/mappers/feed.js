/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');
var _path = require('path');
var resultsMapper = require('./results');

function addressToShortString (address) {
  return address ? address.city +', ' + address.state + ' ' + address.zip : '';
};

function addressToJson (address) {
  return address ? {
    location_name: address.location_name,
    line1: address.line1,
    line2: address.line2,
    line3: address.line3,
    city: address.city,
    state: address.state,
    zip: address.zip
  } : undefined;
};

var mapFeed = function(path, feed) {
  var dueIn = "N/A"
  if(feed._election){
    var now = moment();
    var electionDate = moment(feed._election.date).utc();
    dueIn = electionDate.diff(now, 'days');

    if(dueIn < 0){
      dueIn = Math.abs(dueIn) + " days ago";
    } else {
      dueIn = dueIn + " days";
    }
  }

  return {
    id: feed.id,
    date: feed._election ? moment(feed._election.date).utc().format('YYYY-MM-DD') : 'N/A',
    due_in: dueIn,
    state: feed._state ? feed._state.name : 'State Missing',
    type: feed._election ? feed._election.electionType : 'N/A',
    status: feed.feedStatus,
    complete: true, // TODO: add in the boolean to say if the feed is finished completing or not
    name: feed.name,
    self: _path.join(path, feed.id)
  };
};

var mapOverview = function(path, feed) {

  var feedContact = null;
  if(feed._feedContact){
    feedContact = {
      name: (feed._feedContact) ? feed._feedContact.name : null,
      title: (feed._feedContact) ? feed._feedContact.title : null,
      phone: (feed._feedContact) ? feed._feedContact.phone : null,
      fax: (feed._feedContact) ? feed._feedContact.fax : null,
      email: (feed._feedContact) ? feed._feedContact.email : null
    };
  }

  return {
    id: feed.id,
    title: feed.name, //TODO: replace this with a real title for the feed, i.e. 2011-11-03 North Carolina Primary
    error_count: feed.errorCount,
    feed_contact: feedContact,
    date: moment(feed._election.date).utc().format('YYYY-MM-DD'),
    errors: _path.join(path, '/errors'),
    source: _path.join(path, '/source'),
    election: _path.join(path, '/election'),
    state: _path.join(path, '/election/state'),
    county_map: _path.join('/services/geo/', feed._state.elementId.toString(), 'counties'),
    localities: _path.join(path, '/election/state/localities'),
    polling_locations: _path.join(path, '/polling'),
    contests: _path.join(path, '/contests'),
    results: _path.join(path, '/results'),
    contest_results: _path.join(path, '/election/results/contestresults'),
    ballot_line_results: _path.join(path, '/election/results/ballotlineresults'),
    history: _path.join(path, '/history')
  };
};

var mapSource = function(path, source) {
  return {
    id: source.elementId,
    error_count: source.errorCount,
    errors: _path.join(path, '/errors'),
    source_info: {
      name: source.name,
      date: moment(source.datetime).utc().format('YYYY-MM-DD'),
      description: source.description,
      org_url: source.organizationUrl,
      tou_url: source.touUrl
    },
    feed_contact: {
      name: (source._feedContact) ? source._feedContact.name : null,
      title: (source._feedContact) ? source._feedContact.title : null,
      phone: (source._feedContact) ? source._feedContact.phone : null,
      fax: (source._feedContact) ? source._feedContact.fax : null,
      email: (source._feedContact) ? source._feedContact.email : null
    }
  };
};

var mapElection = function(path, election) {
  return {
    id: election.elementId,
    error_count: election.errorCount,
    errors: _path.join(path, '/errors'),
    date: moment(election.date).utc().format('YYYY-MM-DD'),
    type: election.electionType,
    statewide: election.statewide,
    registration_url: election.registrationInfo,
    absentee_url: election.absenteeBallotInfo,
    results_url: election.resultsUrl,
    polling_hours: election.pollingHours,
    day_of_registration: election.electionDayRegistration,
    registration_deadline: moment(election.registrationDeadline).utc().format('YYYY-MM-DD'),
    absentee_deadline: moment(election.absenteeRequestDeadline).utc().format('YYYY-MM-DD'),
    state: {
      id: election.stateId,
      name: election._state.name,
      locality_count: election._state.localityCount,
      self: _path.join(path, '/state')
    },
    contests: _path.join(path, '/contests')
  };
};

var mapState = function(path, state) {
  return {
    id: state.elementId,
    error_count: state.errorCount,
    errors: _path.join(path, '/errors'),
    name: state.name,
    county_map: _path.join('/services/geo/', state.elementId.toString(), 'counties'),
    administration: (state['_electionAdministration']) ? {
      id: state._electionAdministration.elementId,
      name: state._electionAdministration.name,
      address: addressToShortString(state._electionAdministration.physicalAddress),
      self: _path.join(path, '/electionadministration')
    } : null,
    localities: _path.join(path, '/localities'),
    earlyvotesites: _path.join(path, '/earlyvotesites')
  };
};

var mapLocality = function(path, locality) {
  return {
    id: locality.elementId,
    error_count: locality.errorCount,
    errors: _path.join(path, '/errors'),
    name: locality.name,
    type: locality.type,
    election_machine_type: "Requires 5.0 Schema",
    poll_book_type: "Requires 5.0 Schema",
    overview: _path.join(path, '/localityoverview'),
    administration: locality['_electionAdministration'] ? {
      id: locality._electionAdministration.elementId,
      name: locality._electionAdministration.name,
      address: addressToShortString(locality._electionAdministration.physicalAddress),
      self: _path.join(path, '/electionadministration')
    } : null,
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    precincts: _path.join(path, '/precincts')
  };
};

var mapEarlyVoteSites = function(path, earlyVoteSites) {
  return earlyVoteSites.map(function (evs) {
    return {
      id: evs.elementId,
      name: evs.name,
      address: addressToShortString(evs.address),
      self: _path.join(path, evs.elementId.toString())
    };
  });
};

var mapLocalityPrecincts = function(path, precincts) {
  return precincts.map(mapLocalityPrecinct.bind(undefined, path));
};

function mapLocalityPrecinct(path, precinct) {
  return {
    id: precinct.elementId,
    name: precinct.name,
    precinct_splits: precinct._precinctSplits.length,
    self: _path.join(path, precinct.elementId.toString())
  };
}

var mapLocalities = function(path, localities) {
  return localities.map(function (locality) {
    return {
      id: locality.elementId,
      name: locality.name,
      type: locality.type,
      precincts: locality._precincts.length,
      self: _path.join(path, locality.elementId.toString())
    };
  });
};

var mapPrecinct = function(path, precinct) {
  return {
    id: precinct.elementId,
    error_count: precinct.errorCount,
    errors: _path.join(path, '/errors'),
    name: precinct.name,
    number: precinct.number,
    ward: precinct.ward,
    mailonly: precinct.mailOnly,
    ballotimage: precinct.ballotStyleImageUrl,
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    electoraldistricts: _path.join(path, '/electoraldistricts'),
    pollinglocations: _path.join(path, '/pollinglocations'),
    precinctsplits: _path.join(path, '/precinctsplits'),
    streetsegments: {
      total: precinct._streetSegments.length,
      error_count: precinct._streetSegments.errorCount,
      errors: _path.join(path, '/streetsegments/errors'),
      self: _path.join(path, '/streetsegments')
    }
  };
};

function mapElectoralDistricts (path, electoralDistrict) {
  return electoralDistrict.map(function (ed) {
    return {
      id: ed.elementId,
      name: ed.name,
      type: ed.type,
      number: ed.number,
      contests: -1, //ed.contests.length, TODO fix
      self: _path.join(path, ed.elementId.toString())
    };
  });
};

function mapElectoralDistrict(path, electoralDistrict) {
  return {
    id: electoralDistrict.elementId,
    error_count: electoralDistrict.errorCount,
    errors: _path.join(path, '/errors'),
    name: electoralDistrict.name,
    type: electoralDistrict.type,
    number: electoralDistrict.number,
    contests: electoralDistrict._contest ? [mapElectionContest(path, electoralDistrict._contest)] : [],
    precincts: electoralDistrict._precincts ?
      electoralDistrict._precincts.map(function(precinct) {
        var precinctPath = _path.join(path, '../state/localities/', precinct.localityId.toString(), 'precincts');
        return mapLocalityPrecinct(precinctPath, precinct)
      }) : [],
    precinctsplits: electoralDistrict._precinctSplits ?
      electoralDistrict._precinctSplits.map(function(precinctSplit) {
        var splitPath = _path.join(path, '../state/localities/', precinctSplit._precinct.localityId.toString(), '/precincts', precinctSplit.precinctId.toString(), 'precinctsplits');
        return mapPrecinctSplitSummary(splitPath, precinctSplit)
      }) : []
  };
};

var mapPollingLocations = function(path, pollingLocations) {
  return pollingLocations.map(function (pl) {
    return {
      id: pl.elementId,
      name: pl.address ? pl.address.locationName : 'Name Missing',
      address: addressToShortString(pl.address),
      self: _path.join(path, pl.elementId.toString())
    };
  });
};

var mapPrecinctPrecinctSplits = function(path, precinctSplits) {
  return precinctSplits.map(mapPrecinctSplitSummary.bind(undefined, path));
};

function mapPrecinctSplitSummary(path, precinctSplit) {
  return {
    id: precinctSplit.elementId,
    name: precinctSplit.name,
    street_segments: precinctSplit._streetSegments.length,
    self: _path.join(path, precinctSplit.elementId.toString())
  };
};

var mapElectionContest = function(path, contest) {
  return {
    id: contest.elementId,
    type: contest.type,
    title: contest.office,
    self: _path.join(path, contest.elementId.toString())
  };
};

function mapContest (path, contest) {
  return {
    id: contest.elementId,
    error_count: contest.errorCount,
    errors: _path.join(path, '/errors'),
    type: contest.type,
    partisan: contest.partisan,
    primary_party: contest.primaryParty,
    electorate_specifications: contest.electorateSpecifications,
    special: contest.special,
    office: contest.office,
    filing_closed_date: contest.filingClosedDate ? moment(contest.filingClosedDate).utc().format('YYYY-MM-DD') : null,
    number_elected: contest.numberElected,
    number_voting_for: contest.numberVotingFor,
    ballot_placement: contest.ballotPlacement,
    overview: _path.join(path, '/contestoverview'),
    ballot: contest['_ballot'] ? {
      id: contest._ballot.elementId,
      candidate_count: contest._ballot.candidates ? contest._ballot.candidates.length : 0,
      referendum_count: contest._ballot.referendumIds ? contest._ballot.referendumIds.length : 0,
      self: _path.join(path, '/ballot')
    } : null,
    electoral_district: contest['_electoralDistrict'] ? {
      id: contest._electoralDistrict.elementId,
      name: contest._electoralDistrict.name,
      precincts: contest._electoralDistrict._precincts.length,
      precinct_splits: contest._electoralDistrict._precinctSplits.length,
      self: _path.join(path, '/electoraldistrict')
    } : null,
    contest_result: contest['_contestResult'] ? {
      id: contest._contestResult.elementId,
      votes: contest._contestResult.totalVotes,
      valid_votes: contest._contestResult.totalValidVotes,
      overvotes: contest._contestResult.overvotes,
      blank_votes: contest._contestResult.blankVotes,
      certification: contest._contestResult.certification,
      self: _path.join(path, '/contestresult')
    } : null,
    ballot_line_results: resultsMapper.mapBallotLineResults(path, contest._ballotLineResults)
  };
};


var mapOverviewTables = function(data) {
  var overview = [];
  data.forEach(function(element) {
    overview.push({
      element_type: element.elementType,
      amount: element.amount,
      complete_pct: element.completePct,
      error_count: element.errorCount
    });
  });
  return overview;
};

var mapHistory = function(path, data) {
  return [ //TODO: All of these are hardcoded currently
    {
      date: moment(new Date()).format('YYYY-MM-DD'),
      events: [
        {
          time: moment('1:11 PM', 'h:mm A').format('h:mm A'),
          description: 'Processing'
        },
        {
          time: moment('2:13 PM', 'h:mm A').format('h:mm A'),
          description: 'Ready'
        }
      ]
    }
  ];
};

function mapStreetSegments (path, streetSegments) {
  return streetSegments.map(function (st) {
    return {
      id: st.elementId,
      start_house_number: st.startHouseNumber,
      end_house_number: st.endHouseNumber,
      odd_even: st.oddEvenBoth,
      address: st.nonHouseAddress ? {
        house_number: st.nonHouseAddress.houseNumber,
        house_number_prefix: st.nonHouseAddress.houseNumberPrefix,
        house_number_suffix: st.nonHouseAddress.houseNumberSuffix,
        street_direction: st.nonHouseAddress.streetDirection,
        street_name: st.nonHouseAddress.streetName,
        street_suffix: st.nonHouseAddress.streetSuffix,
        address_direction: st.nonHouseAddress.addressDirection,
        apartment: st.nonHouseAddress.apartment,
        city: st.nonHouseAddress.city,
        state: st.nonHouseAddress.state,
        zip: st.nonHouseAddress.zip
      } : null
    };
  });
};

function mapStreetSegmentsErrors (path, streetSegments) {  //TODO: Replace with non-hardcoded data
  return [
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 752,
      title: "Overlapping street segment in precinct",
      details: "Street Segments are overlapping.",
      textualReference:
        "<street-segments><street-segment>1</street-segment><street-segment>2</street-segment></street-segments>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 100,
      title: "Duplicate elements",
      details: "All values for an element are the exact same as another element in all instances except for their id.",
      textualReference: "<elements><element id='x1'>one</element><element id='x2'>one</element></elements>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 15,
      title: "Failed Geocoding",
      details: "Could not Geocode correctly.",
      textualReference: "The GeoCode long1234.32123 could not be parsed.",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Error",
      errorTypeId: 1,
      error_count: 8,
      title: "Missing required element",
      details: "Did not find the id",
      textualReference: "<state>Virginia</state>",
      _feed: 0,
      _source: 0
    }
  ];
};

function mapStreetSegmentsErrors2 (path, streetSegments) { //TODO: Replace with non-hardcoded data
  return [
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 111,
      title: "A warning",
      details: "Street Segments are overlapping.",
      textualReference:
        "<street-segments><street-segment>1</street-segment><street-segment>2</street-segment></street-segments>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 222,
      title: "Another warning",
      details: "All values for an element are the exact same as another element in all instances except for their id.",
      textualReference: "<elements><element id='x1'>one</element><element id='x2'>one</element></elements>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Error",
      errorTypeId: 1,
      error_count: 444,
      title: "New Error",
      details: "Did not find the id",
      textualReference: "<states><state>MD</state><state>VA</state></states>",
      _feed: 0,
      _source: 0
    }
  ];
};

function mapPrecinctSplit (path, precinctSplit) {
  return {
    id: precinctSplit.elementId,
    error_count: precinctSplit.errorCount,
    errors: _path.join(path, '/errors'),
    name: precinctSplit.name,
    electoral_districts: _path.join(path, '/electoraldistricts'),
    polling_locations: _path.join(path, '/pollinglocations'),
    street_segments: {
      error_count: precinctSplit._streetSegments.errorCount,
      errors: _path.join(path, '/streetsegments/errors'),
      total: precinctSplit._streetSegments.length,
      self: _path.join(path, '/streetsegments')
    }
  };
};

function mapEarlyVoteSite (path, earlyVoteSite) {
  return {
    id: earlyVoteSite.elementId,
    error_count: earlyVoteSite.errorCount,
    errors: _path.join(path, '/errors'),
    name: earlyVoteSite.name,
    address: addressToJson(earlyVoteSite.address),
    directions: earlyVoteSite.directions,
    voter_services: earlyVoteSite.voterServices,
    start_date: earlyVoteSite.startDate,
    end_date: earlyVoteSite.endDate,
    days_times_open: earlyVoteSite.daysTimesOpen
  };
};

function mapElectionAdministration (path, electionAdministration) {
  return {
    id: electionAdministration.elementId,
    error_count: electionAdministration.errorCount,
    errors: _path.join(path, '/errors'),
    name: electionAdministration.name,
    physical_address: addressToJson(electionAdministration.physicalAddress),
    mailing_address: addressToJson(electionAdministration.mailingAddress),
    phone: -1, // TODO: need field
    email: -1, // TODO: need field
    elections_url: electionAdministration.electionsUrl,
    registration_url: electionAdministration.registrationUrl,
    am_i_registered_url: electionAdministration.amIRegisteredUrl,
    absentee_url: electionAdministration.absenteeUrl,
    where_do_i_vote_url: electionAdministration.whereDoIVoteUrl,
    what_is_on_my_ballot_url: electionAdministration.whatIsOnMyBallotUrl,
    rules_url: electionAdministration.rulesUrl,
    voter_services: electionAdministration.voterServices,
    election_official: electionAdministration._electionOfficial ?
      mapElectionOfficial(electionAdministration._electionOfficial) : null,
    overseas_voter_contact: electionAdministration._overseasVoterContact ?
      mapElectionOfficial(electionAdministration._overseasVoterContact) : null,
    hours: electionAdministration.hours
  };
};

function mapElectionOfficial (electionOfficial) {
  return {
    id: electionOfficial.elementId,
    name: electionOfficial.name,
    title: electionOfficial.title,
    phone: electionOfficial.phone,
    fax: electionOfficial.fax,
    email: electionOfficial.email
  };
};

function mapBallot(path, ballot) {
  return {
    id: ballot.elementId,
    error_count: ballot.errorCount,
    errors: _path.join(path, '/errors'),
    write_in: ballot.writeIn,
    image_url: ballot.imageUrl,
    candidates: mapBallotCandidates(_path.join(path, '/candidates'), ballot.candidates),
    referenda: mapReferenda(_path.join(path, 'referenda'), ballot._referenda),
    custom_ballot: ballot['_customBallot'] ? {
      id: ballot._customBallot.elementId,
      error_count: ballot._customBallot.errorCount,
      errors: _path.join(path, '/customballot/errors'),
      heading: ballot._customBallot.heading,
      ballot_responses_error_count: ballot._customBallot.ballotResponseErrorCount,
      ballot_responses: ballot._customBallot.ballotResponses.map(mapBallotResponse)
    } : null
  };
};

function mapReferenda(path, referenda) {
  return referenda.map(function(referendum) {
    return {
      id: referendum.elementId,
      title: referendum.title,
      self: _path.join(path, referendum.elementId.toString())
    };
  });
};

function mapReferendum(path, referendum) {
  return {
    id: referendum.elementId,
    error_count: referendum.errorCount,
    errors: _path.join(path, '/errors'),
    title: referendum.title,
    subtitle: referendum.subtitle,
    brief: referendum.brief,
    text: referendum.text,
    pro_statement: referendum.proStatement,
    con_statement: referendum.conStatement,
    passage_threshold: referendum.passageThreshold,
    effect_of_abstain: referendum.effectOfAbstain,
    ballot_responses_error_count: referendum.ballotResponsesErrorCount,
    ballot_responses: referendum.ballotResponses.map(mapBallotResponse)
  };
};

function mapBallotResponse(response) {
  return {
    id: response._response.elementId,
    text: response._response.text,
    sort_order: response._response.sortOrder
  };
};

var mapBallotCandidates = function(path, candidates) {
  return candidates ? candidates.map(function(candidate) {
    return {
      id: candidate.elementId,
      name: candidate._candidate.name,
      party: candidate._candidate.party,
      sort_order: candidate.sortOrder,
      self: _path.join(path, candidate.elementId.toString())
    };
  }) : [];
};

var mapCandidate = function (path, candidate) {
  return {
    id: candidate.elementId,
    error_count: candidate.errorCount,
    errors: _path.join(path, '/errors'),
    name: candidate.name,
    incumbent: candidate.incumbent, //TODO: v5.0 element
    party: candidate.party,
    candidate_url: candidate.candidateUrl,
    biography: candidate.biography,
    phone: candidate.phone,
    photo_url: candidate.photoUrl,
    filed_mailing_address: addressToJson(candidate.filedMailingAddress),
    email: candidate.email,
    sort_order: candidate.sortOrder
  };
};

function mapPollingLocation(path, pollingLocation) {
  return {
    id: pollingLocation.elementId,
    error_count: pollingLocation.errorCount,
    errors: _path.join(path, '/errors'),
    address: addressToJson(pollingLocation.address),
    directions: pollingLocation.directions,
    photo_url: pollingLocation.photoUrl,
    polling_hours: pollingLocation.pollingHours,
    precincts: pollingLocation._precincts.map(mapPollingLocationPrecinctSummary.bind(undefined, path)),
    precinct_splits: pollingLocation._precinctSplits.map(mapPollingLocationPrecinctSplitSummary.bind(undefined, path))
  };
};

function mapPollingLocationPrecinctSummary(path, precinct) {
  return {
    id: precinct.elementId,
    name: precinct.name,
    electoral_districts: precinct._electoralDistricts.length,
    self: _path.join(path, '../../..', precinct.elementId.toString())
  };
}

function mapPollingLocationPrecinctSplitSummary(path, precinctSplit) {
  return {
    id: precinctSplit.elementId,
    name: precinctSplit.name,
    electoral_districts: precinctSplit._electoralDistricts.length,
    self: _path.join(path, '../../..', precinctSplit.precinctId.toString(), 'precinctsplits', precinctSplit.elementId.toString())
  };
}

exports.mapFeed = mapFeed;
exports.mapFeedOverview = mapOverview;
exports.mapSource = mapSource;
exports.mapElection = mapElection;
exports.mapState = mapState;
exports.mapLocality = mapLocality;
exports.mapEarlyVoteSites = mapEarlyVoteSites;
exports.mapLocalityPrecincts = mapLocalityPrecincts;
exports.mapLocalities = mapLocalities;
exports.mapPrecinct = mapPrecinct;
exports.mapElectoralDistricts = mapElectoralDistricts;
exports.mapElectoralDistrict = mapElectoralDistrict;
exports.mapPollingLocations = mapPollingLocations;
exports.mapPrecinctPrecinctSplits = mapPrecinctPrecinctSplits;
exports.mapElectionContest = mapElectionContest;
exports.mapHistory = mapHistory;
exports.mapStreetSegments = mapStreetSegments;
exports.mapStreetSegmentsErrors = mapStreetSegmentsErrors;
exports.mapStreetSegmentsErrors2 = mapStreetSegmentsErrors2;
exports.mapPrecinctSplit = mapPrecinctSplit;
exports.mapEarlyVoteSite = mapEarlyVoteSite;
exports.mapElectionAdministration = mapElectionAdministration;
exports.mapContest = mapContest;
exports.mapBallot = mapBallot;
exports.mapBallotCandidates = mapBallotCandidates;
exports.mapCandidate = mapCandidate;
exports.mapContestResult = resultsMapper.mapContestResult;
exports.mapBallotLineResults = resultsMapper.mapBallotLineResults;
exports.mapBallotLineResult = resultsMapper.mapBallotLineResult;
exports.mapReferenda = mapReferenda;
exports.mapReferendum = mapReferendum;
exports.mapPollingLocation = mapPollingLocation;
exports.mapOverviewTables = mapOverviewTables;
exports.mapResultsContestResults = resultsMapper.mapResultsContestResults;
exports.mapResultsBallotLineResults = resultsMapper.mapResultsBallotLineResults;
