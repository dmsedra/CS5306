Meteor.methods({
	'insertPlayerData': function(selectedMaterial){
		var currentUserId = Meteor.userId();
		PlayerList.update({createdBy:currentUserId}, {$set: {material: selectedMaterial}}, {upsert:true});
		//console.log(PlayerList.find({createdBy: currentUserId}).fetch());
	}
});

Meteor.publish('thePlayers', function(){
	return PlayerList.find()
});
