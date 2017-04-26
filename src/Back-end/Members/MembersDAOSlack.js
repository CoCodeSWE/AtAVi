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
		let self = this;
		return new Rx.Observable(function(observer)
		{
			self.client.users.info(id,function(err,data)
			{
				if (err)
					observer.error(err);
				else if (!data.user)
						observer.error('User not found');
				else
				{
					observer.next(data);
					observer.complete();
				}
			});
		});
	}

	getMemberList()
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			self.client.users.list(function(err,data)
			{
				if (err)
					observer.error(err);
				else if (!data.members)
					observer.error('Members not found');
				else
				{
						observer.next(data);
						observer.complete();
				}
			});
		});
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
