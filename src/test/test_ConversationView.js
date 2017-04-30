const expect = chai.expect;

describe('Client', function()
{
	describe('ConversationApp', function()
	{
		describe('ConversationView', function()
		{
			let view = new ConversationView();
			describe('render', function() {
				it('Vogliamo testare che l\'oggetto ritornato dalla funzione sia effettivamente un ReactElement.', function()
				{
					let element = view.render();
					expect(element).to.be.an.instanceof(ReactElement);
				});
			});
		});
	});
});
