const expect = chai.expect;

describe('Client', function()
{
	describe('ConversationApp', function()
	{
		describe('ConversationView', function()
		{
			let view = new ConversationView({msgs: [{text: "", sender: 1}, {text: "", sender: 1}]});
			describe('render', function() {
				it('Vogliamo testare che l\'oggetto ritornato dalla funzione sia un ReactElement valido.', function()
				{
					let element = view.render();
					expect(React.isValidElement(element)).to.be.true;
				});
			});
		});
	});
});
