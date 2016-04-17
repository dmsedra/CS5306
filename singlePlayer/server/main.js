

Meteor.startup(function(){
	if (! Games.findOne({})){
		Games.insert({firstPlayer:"",secondPlayer:"",thirdPlayer:"",
			firstPlayerSelection:"",secondPlayerSelection:"",thirdPlayerSelection:"",
			numPlayers: 0, imageLocation:"/data/table.jpg",
			material1:"wood",material2:"glass",material3:"plastic",groundTruth:"wood"});
	}
	
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

		if (Games.findOne({numPlayers: 2})){
			Games.update({numPlayers:2},{$set:{numPlayers:3,thirdPlayer:userId}});
		} else if (Games.findOne({numPlayers:1})){
			Games.update({numPlayers:1},{$set:{numPlayers:2,secondPlayer:userId}});
		} else {
			guid = Games.findOne({numPlayers:0})._id;
			Games.update({_uid:guid},{$set:{numPlayers:1,firstPlayer:userId}});
		}
	}
});

Meteor.publish('thePlayers', function(){
	return PlayerList.find()
});

Meteor.publish('Queued', function(){
	return Queued.find()
});

Meteor.publish('games', function(){
	var currentUserId = this.userId;
	// console.log(currentUserId);
	if (Games.findOne({firstPlayer:currentUserId})){
		return Games.find({firstPlayer:currentUserId});
	}else if (Games.findOne({secondPlayer:currentUserId})){
		return Games.find({secondPlayer:currentUserId});
	}else {
		return Games.find({thirdPlayer:currentUserId});
	}
	// return Games.find();
});