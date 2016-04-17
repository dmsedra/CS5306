Meteor.subscribe('thePlayers');
countdown = new ReactiveCountdown(30,{
				completed:function(){
					//done with this game
					console.log("GAME OVER");
					Meteor.call('endGame', Games.findOne({})._id);
				},});

Meteor.startup(function (){
	Meteor.subscribe('games',{
		onReady:function(){
			var t = Games.findOne({}).timeRemaining;
			countdown.start();
		}
	});
	Meteor.subscribe('Queued');
});


Template.choices.helpers({
	'master': function(){
		var email = Meteor.user().emails[0].address
		//check if admin for special client powers
		if(email != 'admin@.com'){
			console.log('REGULAR!!');
			var id = Meteor.userId();//should be assignmentID from Turkserver
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
		if ($.trim(selectedMaterial) == $.trim(g[material])){
			return "selected";
		} else {
			return "notSelected";
		}
	},
	'playerSelection':function(player) {
		console.log(player);
		var g = Games.findOne({});
		if (g){
			return g[player].concat(g[player.concat("Selection")]);
		}
	},
	'imageLocation': function(){
		return Games.findOne().imageLocation;
		// return '/data/table.jpg';
	},
	'materialNameAndNum': function(mat){
		var g = Games.findOne();
		var m = g[mat];
		var c = 0;
		if (g.firstPlayerSelection == m) {
			c = c + 1;
		}
		if (g.secondPlayerSelection == m) {
			c = c + 1;
		}
		if (g.thirdPlayerSelection == m) {
			c = c + 1;
		}
		return m.concat("  + ".concat(c)) ;
		// return 'material1';
	},
	'gameRunning': function(){
		if (Games.findOne({})){
			return true;
		} else {
			return false;
		}
	},
	'game':function(){
		return Games.find().fetch();
	},
	'timeRemaining':function(){
		return countdown.get();
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
				Meteor.call('assignUser',queuedUser.user);
			});	
		}
	}
});

Template.choices.events({
	'click .material': function(event){
		var selectedMaterial = $(event.target).text();
		if (selectedMaterial.indexOf("+") != -1){
			selectedMaterial = selectedMaterial.substring(0,selectedMaterial.indexOf("+"))
		}
		Meteor.call('insertPlayerData',selectedMaterial.trim());
		console.log(PlayerList.find({material:selectedMaterial}).count());
		console.log(PlayerList.find().count());
		if(PlayerList.find({material:selectedMaterial}).count() == PlayerList.find().count()){
			console.log('Consensus!!!!');
		}
	}
});