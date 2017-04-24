class UsersService
{
	constructor(user)
	{
		this.users = user;
	}
	
	addUser(event, context)
	{
		let user = JSON.parse(event.body);
		this.users.addUser(user).subscribe(
		{
			
		});
	}
	
	deleteUser(event, context)
	{
		
	}
	
	getUser(event, context)
	{
		
	}
	
	getUserList(event, context)
	{
		
	}
	
	updateUser(event, context)
	{

	}	
}

function next()
{
	
}

module.exports = UsersService;
