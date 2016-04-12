import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  goToExitSurvey: function() {
    var exp = TurkServer.Instance.currentInstance();
    exp.teardown();
  },
   incClicks: function() {
    Clicks.update({}, {$inc: {count: 1}});
    var asst = TurkServer.Assignment.currentAssignment();
    asst.addPayment(0.1);
  }
}); 

Meteor.publish('clicks', function() {
  return Clicks.find();
});

TurkServer.initialize(function() {
  var clickObj = {count: 0};
  Clicks.insert(clickObj);
});

var batch = TurkServer.Batch.getBatchByName("main");
batch.setAssigner(new TurkServer.Assigners.SimpleAssigner);