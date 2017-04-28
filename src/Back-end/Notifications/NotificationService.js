const Promise = require('bluebird');

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

    let promise  = new Promise(function(resolve,reject){resolve([]);});
    let trovato = true;

    const type_functions =
    {
      'channels':
      function(result)
      {
        console.log('channels');
        return new Promise(function(resolve, reject)
        {
          self.client.channels.list(function(err,data)
          {
            console.log('callback');
            if (err)
            {
              console.log('reject');
              reject(
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
              console.log('resolve');
              resolve(result);
            }
          });
        });
      },
      'groups': function(result)
      {
        return new Promise(function(resolve, reject)
        {
          console.log('groups');
          self.client.groups.list(function(err,data)
          {
            console.log('callback');
            if (err)
            {
              console.log('reject');
              reject(
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
              console.log('resolve');
              resolve(result);
            }
          });
        });
      },
      'users': function(result)
      {
        console.log('users');
        return new Promise(function(resolve, reject)
        {
          self.client.users.list(function(err,data)
          {
            console.log('callback');
            if (err)
            {
              console.log('reject');
              reject(
              {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal server error' })
              });
            }
            else
            {
              console.log('user');
              data.members.forEach(function(item)
              {
                result.push(
                {
                  name: item.name,
                  id: item.id,
                  type: 'user'
                });
              });
              console.log('resolve');
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
      console.log('last', d);
      context.succeed(
      {
        statusCode: 200,
        body: JSON.stringify(result)
      });

    })
    .catch(function(err)
    {
      console.log('err');
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
