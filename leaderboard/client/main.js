console.log("Hello World");

if(Meteor.isClient){
	Meteor.subscribe('thePlayers');

	Template.leaderBoard.helpers({
		'player' : function(){
			var currentUserId = Meteor.userId();
			return PlayerList.find({}, {sort: {score: -1, name : 1}})
		},
		'selectedClass': function(){
			var playerId = this._id
			var selectedPlayer = Session.get('selectedPlayer');
			if(playerId == selectedPlayer){
				return 'selected'
			}
		}
	});

	Template.leaderBoard.events({
		'click .player': function(){
			var playerId = this._id;
			console.log(playerId);
			Session.set('selectedPlayer', playerId);
			
		},
		'click .increment': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.update(selectedPlayer, {$inc: {score : 5}});

		},
		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.update(selectedPlayer, {$inc: {score : -5}});

		},
		'showSelectedPlayer': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			return 'cats'
		},
		'click .remove': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.remove(selectedPlayer);
		}
	});

	Template.addPlayerForm.events({
		'submit form': function(event){
			event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			Meteor.call('insertPlayerData', playerNameVar);
		}
	});
}