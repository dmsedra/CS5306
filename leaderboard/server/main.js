if(Meteor.isServer){
	Meteor.methods({
			'insertPlayerData': function(playerNameVar){
				var currentUserId = Meteor.userId();
				PlayerList.insert({
					name: playerNameVar,
					score: 0,
					createdBy: currentUserId
				});
			}
	});

	Meteor.publish('thePlayers',function(){
		var currentUserId = this.userId;
		return PlayerList.find({createBy: currentUserId})
	});
}