import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Tracker.autorun(function() {
  if (TurkServer.inExperiment()) {
    Router.go('/experiment');
  } else if (TurkServer.inExitSurvey()) {
    Router.go('/survey');
  } else if (TurkServer.inLobby()){
  	Router.go('/lobby');
  }

});
