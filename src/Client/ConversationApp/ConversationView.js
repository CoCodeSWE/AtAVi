class ConversationView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement('ul', null, this.props.msgs.map(msg => React.createElement('li', null, msg.text)));
  }
}
