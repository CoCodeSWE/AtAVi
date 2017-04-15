class ConversationView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return(
      <ul>
        {this.props.msgs.map((msg) => (<li>{msg.text}</li>))}
      </ul>
    );
  }
}
