// Per eseguire i test
onload = function()
{
	mocha.checkLeaks();
	mocha.globals(['foo']);
	var runner = mocha.run();
};