//import sinon from 'sinon';
const sinon = require('sinon');

let stub =
{
  _reset: function()
  {
    stub.cb = {},
    stub.get = sinon.stub(),
    stub.delete = sinon.stub(),
    stub.update = sinon.stub(),
    stub._scan = function(params, cb)
    {
  		let scan = stub._scan;
      scan.cb = cb;
    },
  	stub.scan = sinon.spy(stub._scan),
    stub.scan.yield = function(...args)
    {
      stub._scan.cb(...args);
    }
    stub.put = sinon.stub()
  }
};

module.exports = stub;
