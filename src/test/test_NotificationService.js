const NotificationService = require('../Back-end/Notifications/NotificationService');
const chai = require('chai');
const expect = chai.expect;
const client = require('./stubs/SlackWebClient');
const context = require('./stubs/LambdaContext');
const sinon = require('sinon');
const promise = require ('./stubs/RequestPromise');

let service;

beforeEach(function()
{
  client._reset();
  service = new NotificationService(client);
  context.succeed = sinon.stub();
});

describe('Back-end', function()
{
  describe('Notifications', function()
  {
    describe('NotificationService', function()
    {
      describe('getChannelList', function()
      {
        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sui canali a Slack, il campo statusCode della risposta deve essere impostato a 500.", function(done)
        {
          let ev = {body: '', queryStringParameters: ''};
          service.getChannelList(ev, context);
          client.groups.list.yields(null, groups);
          client.users.list.yields(null, users);
          client.channels.list.yields('errore');
          context.succeed = function(args)
          {
            expect(args).to.have.property('statusCode', 500);
            done();
          }
        });

        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sugli utenti a Slack, il campo statusCode della risposta deve essere impostato a 500.", function(done)
        {
					let ev = {body: '', queryStringParameters: ''};
          service.getChannelList(ev, context);
          client.groups.list.yields(null, groups);
          client.users.list.yields('errore');
          client.channels.list.yields(null, channels);
          context.succeed = function(args)
          {
            expect(args).to.have.property('statusCode', 500);
            done();
          }
        });

        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sui gruppi a Slack, il campo statusCode della risposta deve essere impostato a 500.", function(done)
        {
					let ev = {body: '', queryStringParameters: ''};
          service.getChannelList(ev, context);
          client.groups.list.yields('errore');
          client.users.list.yields(null, users);
          client.channels.list.yields(null, channels);
          context.succeed = function(args)
          {
            expect(args).to.have.property('statusCode', 500);
            done();
          }
        });

        it("Nel caso in cui non si verifichino errori, il campo statusCode della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista dei canali Slack (utenti, canali pubblici e gruppi privati) in formato JSON.", function(done)
        {
          let ev = {body: '', queryStringParameters: null};
          service.getChannelList(ev, context);
          client.groups.list.yields(null, groups);
          client.users.list.yields(null, users);
          client.channels.list.yields(null, channels);
          context.succeed = function(args)
          {
            expect(args).to.have.property('statusCode', 200);
            done();
          }
        });
      });

      describe('sendMsg', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo statusCode della risposta deve essere impostato a 500.", function()
				{
					let ev = {request_event};
					service.sendMsg(ev, context);
					client.chat.postMessage.yield('errore');

					expect(context.succeed.callCount).to.equal(1);
					let call = context.succeed.getCall(0);

					expect(call.args[0]).to.have.property('statusCode', 500);
				});

        it("Nel caso in cui non si verifichi alcun errore, il campo statusCode della risposta deve essere impostato a 200.", function()
				{
					let ev = {request_event};
					service.sendMsg(ev, context);
					client.chat.postMessage.yield(null, responseSendMsg);

					expect(context.succeed.callCount).to.equal(1);
					let call = context.succeed.getCall(0);

					expect(call.args[0]).to.have.property('statusCode', 200);
				});

				it("Nel caso in cui sia passato un parametro non atteso, il campo statusCode della risposta deve essere impostato a 400.", function()
				{
					let ev = {body: JSON.stringify(bad_request)};
					service.sendMsg(ev, context);

					expect(context.succeed.callCount).to.equal(1);
					let call = context.succeed.getCall(0);
					expect(call.args[0]).to.have.property('statusCode', 400);
				});
      });
    });
  });
});

//VARIABILI UTILIZZATE
const users =
{
  "ok": true,
  "members": [
  {
    "id": "U023BECGF",
    "team_id": "T021F9ZE2",
    "name": "bobby",
    "deleted": false,
    "status": null,
    "color": "9f69e7",
    "real_name": "Bobby Tables",
    "tz": "America\/Los_Angeles",
    "tz_label": "Pacific Daylight Time",
    "tz_offset": -25200,
    "profile":
    {
      "avatar_hash": "ge3b51ca72de",
      "current_status": ":mountain_railway: riding a train",
      "first_name": "Bobby",
      "last_name": "Tables",
      "real_name": "Bobby Tables",
      "email": "bobby@slack.com",
      "skype": "my-skype-name",
      "phone": "+1 (123) 456 7890"
    },
    "is_admin": true,
    "is_owner": true,
    "updated": 1490054400,
    "has_2fa": false
  }]
};

const channels =
{
  "ok": true,
  "channels": [
		{
			"id": "C024BE91L",
			"name": "fun",
			"created": 1360782804,
			"creator": "U024BE7LH",
			"is_archived": false,
			"is_member": false,
			"num_members": 6,
			"topic":
			{
				"value": "Fun times",
				"creator": "U024BE7LV",
				"last_set": 1369677212
			},
			"purpose":
			{
				"value": "This channel is for fun",
				"creator": "U024BE7LH",
				"last_set": 1360782804
			}
		}
  ]
};

const groups =
{
	"ok": true,
  "groups": [
	{
		"id": "G024BE91L",
		"name": "secretplans",
		"created": 1360782804,
		"creator": "U024BE7LH",
		"is_archived": false,
		"members": [
				"U024BE7LH"
		],
		"topic":
		{
			"value": "Secret plans on hold",
			"creator": "U024BE7LV",
			"last_set": 1369677212
		},
		"purpose":
		{
			"value": "Discuss secret plans that no-one else should know",
			"creator": "U024BE7LH",
			"last_set": 1360782804
		}
	}]
};

const responseSendMsg =
{
	"ok": true,
	"ts": "1405895017.000506",
	"channel": "C024BE91L",
	"message":
	{
		//info posted message
	}
};

const request_event =
{
  pathParameters:
  {
    channel: 'mou'
  },
  body: JSON.stringify(
  {
    msg:
    {
      attachments: [
      {
        actions: [
        {
          confirm:
          {
            dismiss_text: 'dismiss',
            ok_text: 'ok',
            text: 'text',
            title: 'title'
          },
          name: 'nome',
          style: 'stile',
          text: 'testo',
          type: 'tipo',
          value: 'valore'
        }],
        callback_id: 'callback',
        color: 'blue',
        fallback: 'fallback',
        title: 'example'
      }],
      text : 'ciao'
    }
  })
};

const bad_request =
{
	msg:
	{
		"text": "testo di prova"
	}
};
