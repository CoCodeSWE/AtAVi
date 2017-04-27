const NotificationService = require('../Back-end/Notifications/NotificationService');
const chai = require('chai');
const expect = chai.expect;
const client = require('./stubs/SlackWebClient');
const context = require('./stubs/LambdaContext');
const sinon = require('sinon');

let service;

beforeEach(function()
{
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
        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sui canali a Slack, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
          let ev = {body: ''};
          service.getChannelList(ev, context);
          client.users.list.yield(null, users);
          client.channels.list.yield('errore');
          client.groups.list.yield(null, groups);
          let call = context.succeed.getCall(0);
          expect(context.succeed.callCount).to.equal(1);
          expect(call.args[0]).to.have.property('statusCode', 500);
        });
        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sugli utenti a Slack, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
					let ev = {body: ''};
          service.getChannelList(ev, context);
          client.users.list.yield('errore');
          client.channels.list.yield(null, channels);
          client.groups.list.yield(null, groups);

          expect(context.succeed.callCount).to.equal(1);
          let call = context.succeed.getCall(0);
          expect(call.args[0]).to.have.property('statusCode', 500);
        });
        it("Nel caso in cui si verifichi un errore nella richiesta delle informazioni sui gruppi a Slack, il campo statusCode della risposta deve essere impostato a 500.", function()
        {
					let ev = {body: ''};
          service.getChannelList(ev, context);
          client.users.list.yield(null, users);
          client.channels.list.yield(null, channels);
          client.groups.list.yield('errore');

          expect(context.succeed.callCount).to.equal(1);
          let call = context.succeed.getCall(0);
          expect(call.args[0]).to.have.property('statusCode', 500);
        });
        it("Nel caso in cui non si verifichino errori, il campo statusCode della risposta deve essere impostato a 200 ed il corpo della risposta deve contenere la lista dei canali Slack (utenti, canali pubblici e gruppi privati) in formato JSON.", function()
        {
          let ev = {body: ''};
          service.getChannelList(ev, context);
          client.users.list.yield(null, users);
          client.channels.list.yield(null, channels);
          client.groups.list.yield(null, groups);

          expect(context.succeed.callCount).to.equal(1);
          let call = context.succeed.getCall(0);

          expect(call.args[0]).to.have.property('statusCode', 200);
        });
      });

      describe('sendMsg', function(done)
      {
        it("Nel caso in cui si verifichi un errore, il campo statusCode della risposta deve essere impostato a 500.", function()
				{
					let ev = {body: JSON.stringify(request_event)};
					service.sendMsg(ev, context);
					client.chat.postMessage('errore');

					expect(context.succeed.callCount).to.equal(1);
					let call = context.succeed.getCall(0);

					expect(call.args[0]).to.have.property('statusCode', 500);
				});

        it("Nel caso in cui non si verifichi alcun errore, il campo statusCode della risposta deve essere impostato a 200.", function()
				{
					let ev = {body: JSON.stringify(request_event)};
					service.sendMsg(ev, context);
					client.chat.postMessage(null, responseSendMsg);

					expect(context.succeed.callCount).to.equal(1);
					let call = context.succeed.getCall(0);

					expect(call.args[0]).to.have.property('statusCode', 200);
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
}

const request_event =
{
  send_to: 'mou',
  msg:
  {

  }
}
