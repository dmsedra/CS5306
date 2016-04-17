Meteor.subscribe('thePlayers');
Meteor.subscribe('Queued');


Meteor.startup(function (){
	Meteor.subscribe('games');
});

Template.choices.helpers({
	'master': function(){
		var email = Meteor.user().emails[0].address
		//check if admin for special client powers
		if(email != 'admin@.com'){
			console.log('REGULAR!!');
			var id = Meteor.user();//should be assignmentID from Turkserver
			Queued.insert({'user':id});
		}
	},
	'selectedClass': function(material){
		if (Games.findOne({firstPlayer:Meteor.userId()})){
			var selectedMaterial = 
				Games.findOne({firstPlayer:Meteor.userId()})
				.firstPlayerSelection;
		}else if (Games.findOne({secondPlayer:Meteor.userId()})){
			var selectedMaterial = 
				Games.findOne({secondPlayer:Meteor.userId()})
				.secondPlayerSelection;
		}else if (Games.findOne({thirdPlayer:Meteor.userId()})){
			var selectedMaterial = 
				Games.findOne({thirdPlayer:Meteor.userId()})
				.thirdPlayerSelection;
		}
		g = Games.findOne({});
		if (selectedMaterial == g[material]){
			return 'selected';
		}
	},
	'playerSelection':function(player) {
		g = Games.findOne({});
		if (g){
			return g[player].concat(g[player.concat("Selection")]);
		}
	},
	'imageLocation': function(){
		// return Games.find().imageLocation;
		return '/data/table.jpg';
	},
	'material1': function(){
		// return Games.find().material1;
		return 'material1';
	},
	'material2': function(){
		// return Games.find().material2;
		return 'material2';
	},
	'material3': function(){
		// return Games.find().material3;
		return 'material3';
	},
	'gameRunning': function(){
		// console.log(Games.find({}));
		// return false;
	}
});

Queued.find().observeChanges({
	added: function(){
		var email = Meteor.user().emails[0].address
		//check if admin for special client powers
		console.log('inserted');
		if(email == 'admin@.com'){
			console.log('and updating');
			//this is for handling the case that observeChanges
			//is called only once for multiple added users.
			Queued.find().forEach( function(queuedUser){
				Meteor.call('assignUser',queuedUser.userId);
			});	
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