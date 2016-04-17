

Meteor.startup(function(){
	
});

Meteor.methods({
	'insertPlayerData': function(selectedMaterial){
		var currentUserId = Meteor.userId();
		PlayerList.update({createdBy:currentUserId}, {$set: {material: selectedMaterial}}, {upsert:true});
	},
	//console.log(PlayerList.find({createdBy: currentUserId}).fetch());
	'assignUser': function(userId){
		console.log('user being assigned!')
		Queued.remove({'user':userId});
	}
});

Meteor.publish('thePlayers', function(){
	return PlayerList.find()
});

Meteor.publish('Queued', function(){
	return Queued.find()
});

Meteor.publish('games', function(){
	console.log(Games.find().fetch());
	return Games.find({})
});