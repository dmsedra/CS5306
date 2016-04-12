import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Tracker.autorun(function() {
  if (TurkServer.inExperiment()) {
    Router.go('/experiment');
  } else if (TurkServer.inExitSurvey()) {
    Router.go('/survey');
  }
});

Tracker.autorun(function() {
  var group = TurkServer.group();
  if (group == null) return;
  Meteor.subscribe('clicks', group);
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter: function () {
    // get our Click document
    var clickObj = Clicks.findOne();
    // if it exists, return the count field
    return clickObj && clickObj.count;
  }
});

Template.hello.events({
  'click button#clickMe': function () {
    // update our Clicks document
    Meteor.call('incClicks');
  },
  'click button#exitSurvey': function () {
     // go to the exit survey
     Meteor.call('goToExitSurvey');
  }
});

Template.survey.events({
  'submit .survey': function (e) {
    e.preventDefault();
    var results = {confusing: e.target.confusing.value,
                   feedback: e.target.feedback.value}
    TurkServer.submitExitSurvey(results);
  }
});
