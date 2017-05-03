class ConversationView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      "ul",
      null,
      this.props.msgs.map((msg, index) => React.createElement(
        "li",
        { key: index, "data-sender": msg.sender },
        msg.text
      ))
    );
  }
}
//# sourceMappingURL=ConversationView.js.map
