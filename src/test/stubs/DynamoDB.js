//import sinon from 'sinon';
const sinon = require('sinon');

let stub =
{
  cb: {},
  get: sinon.stub(),
  delete: sinon.stub(),
  update: sinon.stub(),
  scan: function(params, cb)
  {
    let scan = stub.scan;
    scan.cb = cb;
    scan.yield = function(...args)
    {
      scan.cb(...args);
    }
  },
	put: sinon.stub()
};

module.exports = stub;
