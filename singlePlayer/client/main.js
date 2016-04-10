Meteor.subscribe('thePlayers');

Template.choices.events({
	'click .material': function(event){
		var selectedMaterial = $(event.target).text();
		Meteor.call('insertPlayerData',selectedMaterial);
		console.log(PlayerList.find({material:selectedMaterial}).count());
		console.log(PlayerList.find().count());
		if(PlayerList.find({material:selectedMaterial}).count() == PlayerList.find().count()){
			console.log('Consensus!!!!');
		}
	}
});