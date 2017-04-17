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
				it('Nel caso in cui il metodo ottenga il membro dell\'azienda allora l\'Observable invia tale Member all\'Observer iscritto tramite il metodo next e lo notifica richiamando una sola volta il metodo complete.');
				it('Se si verifica un errore nell\'ottenere il membro dell\'azienda, l\'Observable deve notificare l\'Observer iscritto richiamando il metodo error.');
			});

			describe('getMemberList', function()
			{
				it('L\'Observable deve notificare l\'Observer con il metodo complete solo dopo aver inviato tutti i blocchi di Member tramite il metodo next.');
				it('Se si verifica un errore nell\'ottenere la lista dei membri dell\'azienda, l\'Observable deve notificare l\'Observer iscritto richiamando il metodo error.');
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
