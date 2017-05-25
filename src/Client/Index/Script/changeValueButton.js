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

var toggleload = 0;
function toggleLoading()
{
  if(toggleload === 0)
  {
    //document.getElementById( 'loading' ).style.backgroundImage = 'url("../Image/loading.gif")';
    document.getElementById( 'staticTitleApp' ).src = 'Image/loader.gif';
    document.getElementById( 'staticTitleApp' ).id = 'loadingImg';
    toggleload = 1;
  }
  else
  {
    //document.getElementById( 'loading' ).style.backgroundImage = 'url("../Image/100.png")';
    document.getElementById( 'loadingImg' ).src = 'Image/100.png';
    document.getElementById( 'loadingImg' ).id = 'staticTitleApp';
    toggleload = 0;
  }
}

function enableKeyboard()
{
  document.getElementById( 'textMsg' ).style.display = 'inherit';
}

function disableKeyboard()
{
  document.getElementById( 'textMsg' ).style.display = 'none';
}
