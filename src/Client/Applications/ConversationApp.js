export var ConversationApp = {
  "setup": "class ConversationView extends React.Component {\n  constructor(props) {\n    super(props);\n  }\n\n  render() {\n    return React.createElement(\n      \"ul\",\n      { id: \"listMessages\" },\n      this.props.msgs.map((msg, index) => React.createElement(\n        \"li\",\n        { key: index, \"data-sender\": msg.sender },\n        msg.text\n      ))\n    );\n  }\n}\n//# sourceMappingURL=ConversationView.js.map\nclass MsgStore\r\n{\r\n  constructor()\r\n  {\r\n    this.msgs = [];\r\n    this.subject = new Rx.Subject();\r\n  }\r\n\r\n  getObservable()\r\n  {\r\n    return this.subject.asObservable();\r\n  }\r\n\r\n  onCmd(action)\r\n  {\r\n    switch(action.cmd)\r\n    {\r\n      case 'displayMsgs':\r\n        action.params.forEach((msg) => this.msgs.push(msg));\r\n        //this.msgs.push({text: action.params[0], sender:0}, {text: action.params[1], sender:1});\r\n        break;\r\n      case 'clear':\r\n        this._onClear();\r\n        break;\r\n      case 'sendMsg':\r\n        this.msgs.push({text: action.params[0], sender:0});\r\n        console.log(\"asdadada\");\r\n        break;\r\n      case 'receiveMsg':\r\n        this.msgs.push({text: action.params[0], sender:1});\r\n        break;\r\n      default: return;\r\n    }\r\n    this.subject.next();\r\n  }\r\n\r\n  _onClear()\r\n  {\r\n    this.msgs = [];\r\n  }\r\n\r\n}\r\n/**\r\n* @desc Questa classe si occupa di gestire il cambio delle applicazioni nel client.\r\n* @author Mauro Carlin\r\n* @version 0.0.4\r\n* @since 0.0.3-alpha\r\n*/\r\nclass Dispatcher\r\n{\r\n  constructor() {\r\n    this.subject = new Rx.Subject();\r\n  }\r\n\r\n  getObservable()\r\n  {\r\n    return this.subject.asObservable();\r\n  }\r\n\r\n  dispatch(cmd, params)\r\n  {\r\n    this.subject.next({ cmd: cmd, params: params });\r\n  }\r\n}\r\nthis.store = new MsgStore();\r\nthis.dispatcher = new Dispatcher();\r\nvar _this = this;\r\nfunction render() {\r\n  ReactDOM.render(React.createElement(ConversationView, _this.store), _this.ui);\r\n  scrollBottom();\r\n}\r\n\r\nthis.store.getObservable().subscribe({\r\n  next: render,\r\n  error: console.log,\r\n  complete: () => console.log('completed')\r\n});\r\n\r\nthis.dispatcher.getObservable().subscribe({\r\n  next: data => _this.store.onCmd(data),\r\n  error: console.log\r\n});\r\n\r\nrender();\r\n//# sourceMappingURL=Container.js.map\r\n//# sourceMappingURL=Container.js.map\r\n",
  "libs": [
    "https://unpkg.com/react@15/dist/react.js",
    "https://unpkg.com/react-dom@15/dist/react-dom.js",
    "https://unpkg.com/rxjs/bundles/Rx.min.js"
  ],
  "ui": "",
  "cmdHandler": "let msg = [{sender: 0, text: params.text_request}, {sender: 1, text: params.text_response}];\r\nthis.dispatcher.dispatch(cmd, msg)\r\n",
  "name": "conversation"
}