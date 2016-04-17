

Meteor.startup(function(){
	if (! Games.findOne({})){
		Games.insert({firstPlayer:"",secondPlayer:"",thirdPlayer:"",
			firstPlayerSelection:"",secondPlayerSelection:"",thirdPlayerSelection:"",
			numPlayers: 0, imageLocation:"/data/table.jpg",
			material1:"wood",material2:"glass",material3:"plastic",groundTruth:"wood",timeRemaining:30});
	}
});

Meteor.methods({
	'insertPlayerData': function(selectedMaterial){
		var currentUserId = Meteor.userId();
		PlayerList.update({createdBy:currentUserId}, {$set: {material: selectedMaterial}}, {upsert:true});
		Games.update({firstPlayer:currentUserId},{$set:{firstPlayerSelection:selectedMaterial}});
		Games.update({secondPlayer:currentUserId},{$set:{secondPlayerSelection:selectedMaterial}});
		Games.update({thirdPlayer:currentUserId},{$set:{thirdPlayerSelection:selectedMaterial}});
	},
	//console.log(PlayerList.find({createdBy: currentUserId}).fetch());
	'assignUser': function(userId){
		console.log('user being assigned!'.concat(userId));
		Queued.remove({'user':userId});

		if (Games.findOne({numPlayers: 2})){
			Games.update({numPlayers:2},{$set:{numPlayers:3,thirdPlayer:userId}});
		} else if (Games.findOne({numPlayers:1})){
			Games.update({numPlayers:1},{$set:{numPlayers:2,secondPlayer:userId}});
		} else if (Games.findOne({numPlayers:0})){
			guid = Games.findOne({numPlayers:0})._id;
			console.log("adding users to game".concat(guid))
			Games.update({_id:guid},{$set:{numPlayers:1,firstPlayer:userId}});
		} else {
			//no more games!
		}
	},
	'endGame': function(gameId){
		console.log("teminate game _id : ".concat(gameId))
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
	if (Games.findOne({firstPlayer:currentUserId,timeRemaining:{$not:{$eq:0}}})){
		return Games.find({firstPlayer:currentUserId,timeRemaining:{$not:{$eq:0}}});
	}else if (Games.findOne({secondPlayer:currentUserId,timeRemaining:{$not:{$eq:0}}})){
		return Games.find({secondPlayer:currentUserId,timeRemaining:{$not:{$eq:0}}});
	}else {
		return Games.find({thirdPlayer:currentUserId,timeRemaining:{$not:{$eq:0}}});
	}
	// return Games.find();
});