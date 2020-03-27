var xhr = new XMLHttpRequest();
var url = "states";
xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) { states = this.responseText.split(";");
    for(i=3;i<=6;i++){
      document.getElementById("state-"+(i-2)).innerHTML = states[i-3];
    }
  }
};
xhr.open("GET", url, true);
xhr.send();

function OnOffLight(i)
{
  var xhr = new XMLHttpRequest();
  var url = "/"+i+"/toggle";
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      state = this.responseText;
      document.getElementById("state-"+(i-2)).innerHTML = state;
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
};