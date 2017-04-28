//import sinon from 'sinon';
const sinon = require('sinon');

let stub =
{
  cb: {},
  get: sinon.stub(),
  delete: sinon.stub(),
  update: sinon.stub(),
  _scan: function(params, cb)
  {
		console.log('params', params);
    let scan = stub.scan;
    scan.cb = cb;
    scan.yield = function(...args)
    {
      scan.cb(...args);
    }
  },
	scan_spy: null,
	put: sinon.stub()
};

stub.scan = sinon.spy(stub._scan);

module.exports = stub;