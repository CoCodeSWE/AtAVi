function changeValueButton()
{
  if(document.getElementById( 'start' ) === null)
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

function toggleKeyboard()
{
  if(document.getElementById( 'textMsg' ).style.display === 'inherit')
    document.getElementById( 'textMsg' ).style.display = 'none';
  else
      document.getElementById( 'textMsg' ).style.display = 'inherit';
}

function toggleLoading()
{
  if(document.getElementById( 'loadingImage' ).style.display === 'inherit')
    document.getElementById( 'loadingImage' ).style.display = 'none';
  else
      document.getElementById( 'loadingImage' ).style.display = 'inherit';
}
