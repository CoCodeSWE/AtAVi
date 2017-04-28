class NotificationService
{
  constructor(client)
  {
    this.client = client;
  }

  getChannelList(event, context)
  {
    let self = this;
    let list = [];
    let types;
    if (event.queryStringParameters.type)
      types = event.queryStringParameters.type.split(',');
    else
      types = ['groups', 'users', 'channels'];

    let promise  = Promise.resolve('');
    let result = [];


    const type_functions =
    {
      'channels': function(d)
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
          }
          else
          {
            data.channels.forEach(function(item)
            {
              result.push(
              {
                name: item.name,
                id: item.id,
                type: 'channel'
              });
            });
          }
        });
      },
      'groups': function(d)
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
          }
          else
          {
            data.groups.forEach(function(item)
            {
              result.push(
              {
                name: item.name,
                id: item.id,
                type: 'group'
              });
            });
          }
        });
      },
      'users': function(d)
      {
        self.client.users.list(function(err,data)
        {
          if (err)
          {
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
              result.push(
              {
                name: item.name,
                id: item.id,
                type: 'user'
              });
            });
          }
        });
      }
    };


    types.forEach( function(type)
    {
      promise = promise.then(type_functions[type]);
    });

    promise = promise.then(function(d)
    {
      context.succeed(
      {
        statusCode: 200,
        body: JSON.stringify(list)
      });
    });

    promise.catch(function(err)
    {
      context.succeed(
      {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });
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
      context.succeed(
      {
        statusCode: 400,
        body: ''
      });
      return;
    }


    const allowed = ['actions','callback_id','color','fallback','title'];
    let attachments_filtered = [];
    body.msg.attachments.forEach(function(item)
    {
      let filtered = Object.keys(item)
                      .filter(key => allowed.includes(key))
                      .reduce((obj,key) =>
                      {
                        obj[key] = item[key];
                        return obj;
                      }, {});

      attachments_filtered.push(filtered);
    });


    self.client.chat.postMessage(body.send_to, body.msg.text, {attachments: JSON.stringify(attachments_filtered)}, function(err,data)
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
        });
      }
    });
  }
}

module.exports = NotificationService;
