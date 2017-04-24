const sinon = require('sinon');
class StreamBuffers
{
  WritableStreamBuffer: sinon.stub(),
  ReadableStreamBuffer: sinon.stub()
}

module.exports = StreamBuffers;
