let msg = [{sender: 0, text: params.text_request}, {sender: 1, text: params.text_response}];
this.dispatcher.dispatch(cmd, msg)
