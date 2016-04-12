import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

var batch = TurkServer.Batch.getBatchByName("main");
batch.setAssigner(new TurkServer.Assigners.ThresholdAssigner);
