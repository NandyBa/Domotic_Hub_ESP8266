cbx = document.getElementsByClassName("cbx")
for(i=0;i<cbx.length;i++){
	cbx[i].onclick = function() {
		val = this.value;
		var xhr = new XMLHttpRequest();
		if(this.checked){
			//On alume
			
			var url = "/"+val+"/on";
		}else{
			//On éteint

			var url = "/"+val+"/off";
		}
		xhr.open("GET", url, true);
		xhr.send();
	}
}
