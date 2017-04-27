class NotificationService
{
  constructor(client)
  {
    this.client = client;
  }

  getChannelList(event, context)
  {
    let self = this;
    var control = true;
    let list = [];
    self.client.users.list(function(err,data)
    {
      if (err)
      {
        control = false; //ho avuto un errore, non vado avanti col creare la lista
        context.succeed(
				{
					statusCode: 500,
					body: JSON.stringify({ message: 'Internal server error' })
				});
      }
      else
      {
        data.members.forEach(function(item)
        {
          list.push(
          {
            name: item.name,
            id: item.id,
            type: 'user'
          });
        });
      }
    });
    if (control === true)
    {
      self.client.channels.list(function(err,data)
      {
        if (err)
        {
          context.succeed(
  				{
  					statusCode: 500,
  					body: JSON.stringify({ message: 'Internal server error' })
  				});
          control = false; //ho avuto un errore, non vado avanti col creare la lista
        }
        else
        {
          data.channels.forEach(function(item)
          {
            list.push(
            {
              name: item.name,
              id: item.id,
              type: 'channel'
            });
          });
        }
      });
    }
    if (control === true)
    {
      self.client.groups.list(function(err,data)
      {
        if (err)
        {
          context.succeed(
  				{
  					statusCode: 500,
  					body: JSON.stringify({ message: 'Internal server error' })
  				});
          control = false; //ho avuto un errore, non vado avanti col creare la lista
        }
        else
        {
          data.groups.forEach(function(item)
          {
            list.push(
            {
              name: item.name,
              id: item.id,
              type: 'group'
            });
          });
        }
      });
      if (control === true)
      {
        context.succeed(
        {
          statusCode: 200,
          body: JSON.stringify(list)
        });
      }
    }
  }

  sendMsg(event, context)
  {
    let self = this;
    let body;
    try
    {
      body = JSON.parse(event.body);
    }
    catch (err)
    {
      //uso succeed per ritornare errore 400
    }
    self.client.chat.postMessage(body.send_to, body.msg.text, body.msg.attachments, function(err,data)
    {
      if (err)
      {
        context.succeed(
        {
          body: '',
          statusCode: 500
        });
      }
      else
      {
        context.succeed(
        {
          body: '',
          statusCode: 200
        })
      }
    });
  }
}

module.exports = NotificationService
