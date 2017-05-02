//import sinon from 'sinon';
const  Rx = require('rxjs');
const sinon = require('sinon');


module.exports = {
  addTask: sinon.stub(),
  getTask: sinon.stub(),
  getTaskList: sinon.stub(),
  removeTask: sinon.stub(),
  updateTask: sinon.stub()
}
