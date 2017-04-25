this.store = new MsgStore();
this.dispatcher = new CmdDispatcher();
var _this = this;
function render() {
  ReactDOM.render(React.createElement(ConversationView, _this.store), _this.ui);
}

this.store.getObservable().subscribe({
  next: render,
  error: console.log,
  complete: () => console.log('completed')
});

this.dispatcher.getObservable().subscribe({
  next: data => _this.store.onCmd(data),
  error: console.log
});

render();
//# sourceMappingURL=Container.js.map
//# sourceMappingURL=Container.js.map
