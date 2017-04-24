const Rx = require('rxjs/Rx');

class MembersDAOSlack
{
	constructor(client)
	{
		this.client = client;
	}
	
	addMember(member)
	{
		return new Rx.Observable(function(observer)
		{
			observer.error('Impossibile aggiungere un nuovo membro');
		});
	}
	
	getMember(id)
	{
		
	}
	
	getMemberList()
	{
		
	}
	
	removeMember(id)
	{
		return new Rx.Observable(function(observer)
		{
			observer.error('Impossibile rimuovere un membro');
		});
	}
	
	updateMember(member)
	{
		return new Rx.Observable(function(observer)
		{
			observer.error('Impossibile aggiornare un membro');
		});
	}
}

module.exports = MembersDAOSlack;
