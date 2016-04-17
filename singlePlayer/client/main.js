Meteor.subscribe('thePlayers');
Meteor.subscribe('Queued');


Meteor.startup(function (){
	Meteor.subscribe('games', function(){
		Games.find().fetch();
	});
	console.log('hello client');
	console.log(Games.find().fetch());
});

Template.choices.helpers({
	'master': function(){
		var email = Meteor.user().emails[0].address
		//check if admin for special client powers
		if(email != 'admin@.com'){
			console.log('REGULAR!!');
			var id = Meteor.userId();
			Queued.insert({'user':id});
		}
	}
});

Queued.find().observeChanges({
	added: function(){
		var email = Meteor.user().emails[0].address
		//check if admin for special client powers
		console.log('inserted');
		if(email == 'admin@.com'){
			console.log('and updating');
			Meteor.call('assignUser',Meteor.userId());
		}
	}
});

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