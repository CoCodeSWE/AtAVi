const MembersDAOSlack = require('../Back-end/Members/MembersDAOSlack');
const Rx = require('rxjs/Rx');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const web_client = require('./stubs/SlackWebClient');

let next, error, complete;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
});

describe('Back-end', function()
{
	describe('Members', function()
	{
		describe('MembersDAOSlack', function ()
		{
			let members = new MembersDAOSlack(web_client);
			describe('addMember', function()
			{
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.', function()
				{
					members.addMember('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});

			describe('getMember', function()
			{
				it('Nel caso in cui il metodo ottenga il membro dell\'azienda allora l\'Observable invia tale Member all\'Observer iscritto tramite il metodo next e lo notifica richiamando una sola volta il metodo complete.', function()
				{
					members.getMember('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					//Docs: https://api.slack.com/methods/users.info
					let res =
					{
						'ok': true,
						'user': 
						{
							'id': 'U023BECGF',
							'name': 'bobby',
							'deleted': false,
							'color': '9f69e7',
							'profile':
							{
								'avatar_hash': 'ge3b51ca72de',
								'current_status': ':mountain_railway: riding a train',
								'first_name': 'Bobby',
								'last_name': 'Tables',
								'real_name': 'Bobby Tables',
								'email': 'bobby@slack.com',
								'skype': 'my-skype-name',
								'phone': '+1 (123) 456 7890'
							},
							'is_admin': true,
							'is_owner': true,
							'updated': 1490054400,
							'has_2fa': true
						}
					};
					
					web_client.info.yield(res);
					
					expect(error.callCount).to.equal(0);
					
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0].id).to.equal(id);
					expect(callNext.args[1].id).to.equal(name);
					
					expect(complete.callCount).to.equal(1);
				});
				
				it('Se si verifica un errore nell\'ottenere il membro dell\'azienda, l\'Observable deve notificare l\'Observer iscritto richiamando il metodo error.', function()
				{
					members.getMember('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					
					//Esempio di errore (https://api.slack.com/methods/users.info/test)
					let res = 
					{
						'ok': false,
						'error': 'not_authed'
					}
					
					web_client.info.yield(res);
					
					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].ok).to.equal(false);
					expect(callError.args[0].error).to.equal('not_authed');
					
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);	
				});
			});

			describe('getMemberList', function()
			{
				it('L\'Observable deve notificare l\'Observer con il metodo complete solo dopo aver inviato tutti i blocchi di Member tramite il metodo next.');
				//res.ok = true;
				
				it('Se si verifica un errore nell\'ottenere la lista dei membri dell\'azienda, l\'Observable deve notificare l\'Observer iscritto richiamando il metodo error.');
				//res.ok = false;
			});

			describe('removeMember', function()
			{
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.', function()
				{
					members.removeMember('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});

			describe('updateMember', function()
			{
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.', function()
				{
					members.updateMember('mou').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(error.callCount).to.equal(1);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
			});
		});
	});
});
