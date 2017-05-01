function changeValue()
{
  if(document.getElementById( 'start' ) == null)
  {
    document.getElementById( 'stop' ).innerHTML = "START";
    document.getElementById( 'stop' ).id = "start";

  }
  else
  {
    document.getElementById( 'start' ).innerHTML = "STOP";
    document.getElementById( 'start' ).id = "stop";
  }
}
