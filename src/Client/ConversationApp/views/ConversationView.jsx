class ConversationView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return(
      <ul id="listMessages">
        {this.props.msgs.map((msg, index) => (<li key={index} data-sender={msg.sender}>{msg.text}</li>))}
      </ul>
    );
  }
}
