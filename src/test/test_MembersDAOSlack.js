const MembersDAOSlack = require('../Back-end/Members/MembersDAOSlack');
const chai = require('chai');

describe('Back-end', function()
{
	describe('Members', function()
	{
		describe('MembersDAOSlack', function ()
		{
			describe('addMember', function()
			{
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.');
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
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.');
			});

			describe('updateMember', function()
			{
				it('Anche se viene passato un Member corretto, l\'ErrorObservable ritornato deve notificare l\'Observer richiamando il suo metodo error.');
			});
		});
	});
});
