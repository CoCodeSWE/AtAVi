/**
* Questa classe si occupa di realizzare il microservizio \file{Notifications}.
* @author Pier Paolo Tricomi
* @version 0.0.7
* @since 0.0.3-alpha
*/
const Promise = require('bluebird');
const objectFilter = require('./object-filter');

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
    if (event.queryStringParameters && event.queryStringParameters.type )
      types = event.queryStringParameters.type.split(',');
    else
      types = ['groups', 'users', 'channels'];

    let promise  = new Promise(function(resolve,reject){resolve([]);});
    let trovato = true;

    const type_functions =
    {
      'channels': function(result)
      {
        return new Promise(function(resolve, reject)
        {
          self.client.channels.list(function(err,data)
          {
            if (err)
            {
              reject(
      				{
      					statusCode: 500,
      					body: JSON.stringify({ message: 'Internal server error: channels', error: err })
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
              resolve(result);
            }
          });
        });
      },
      'groups': function(result)
      {
        return new Promise(function(resolve, reject)
        {
          self.client.groups.list(function(err,data)
          {
            if (err)
            {
              reject(
      				{
      					statusCode: 500,
      					body: JSON.stringify({ message: 'Internal server error: groups', error: err })
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
              resolve(result);
            }
          });
        });
      },
      'users': function(result)
      {
        return new Promise(function(resolve, reject)
        {
          self.client.users.list(function(err,data)
          {
            if (err)
            {
              reject(
              {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal server error: users', error: err })
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
              resolve(result);
            }
          });
        });
      }
    };

    types.forEach( function(type)
    {
      promise = promise.then(type_functions[type]);
      //console.log(type, promise);
    });

    promise.then(function(result)
    {
      var final_result = [];
      if (event.queryStringParameters && event.queryStringParameters.name)
      {
          final_result = result.filter(item => item.name === event.queryStringParameters.name);
      }
      else
      {
          final_result = result;
      }
      context.succeed(
      {
        statusCode: 200,
        body: JSON.stringify(final_result)
      });
    })
    .catch(function(err)
    {
      context.succeed(
      {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error'})
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
        body: JSON.stringify({ message: 'Bad Request' })
      });
      return;
    }

		// Controllo che ci siano i campi obbligatori
		if(body.msg.text && body.send_to)
		{
			let attachments_filtered = null;
			if(body.msg.attachments)
				objectFilter(body.msg.attachments, ['actions','callback_id','color','fallback','title']);

			self.client.chat.postMessage(body.send_to, body.msg.text, {attachments: JSON.stringify(attachments_filtered)}, function(err,data)
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
					context.succeed(
					{
						statusCode: 200,
						body: JSON.stringify({ message: 'success' })
					});
				}
			});
		}
		else
		{
			context.succeed(
			{
				statusCode: 400,
				body: JSON.stringify({ message: 'Bad Request' })
			});
		}
  }
}

module.exports = NotificationService;
