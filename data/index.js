function ChangePhilipsHueState(data, light_id){
	var json = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/lights/"+light_id+"/state";
	xhr.open("PUT", url, true);
	xhr.send(json);
}

cbx = document.getElementsByClassName("cbx")
for(i=0;i<cbx.length;i++){
	cbx[i].onclick = function() {
		var data = {};
		light_id = this.value;
		if(this.checked){
			//On donne comme consigne d'allumer la lampe
			data.on = true;
		}else{
			//On donne comme consigne d'éteindre la lampe
			data.on = false;
		}
		ChangePhilipsHueState(data, light_id);
	}
}
row_interface = document.getElementsByClassName("row-interface");
for (var i = row_interface.length - 1; i >= 0; i--) {
	row_interface[i].getElementsByClassName("slider")[0].onchange = function(){
		slider = this;
		val = slider.value;
		light_id = slider.getAttribute("light-id");
		row_interface[light_id-3].getElementsByClassName('value-slider')[0].innerHTML = val;

		var data = {};
		data.on = true;
		data.bri  = parseInt(254* parseInt(val)/100);

		ChangePhilipsHueState(data, light_id);
	}
}