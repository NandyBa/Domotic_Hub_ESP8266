
function ChangePhilipsHueState(data, light_id){
	var json = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/lights/"+light_id+"/state";
	xhr.open("PUT", url, true);
	xhr.send(json);
}

function ChangePhilipsHueGroupsState(data, group_id){
	var json = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/groups/"+group_id+"/action";
	xhr.open("PUT", url, true);
	xhr.send(json);
}


cbx = document.getElementsByClassName("cbx");
sliders = document.getElementsByClassName("slider");
values_sliders = document.getElementsByClassName('value-slider');

function updateLightsState(){
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/lights/";
	xhr.open("GET", url, true);
	xhr.send();
	xhr.onload = function(){
		if(xhr.status == 200){
			data = JSON.parse(xhr.response);

			for(var index in data){
				if(data[index].state.on){
					cbx[index-3].checked = true;
				}else{
					cbx[index-3].checked = false;
				}
				document.getElementsByClassName("inferface-item")[index-3].getElementsByTagName("span")[0].innerText = data[index].name
				val= parseInt(data[index].state.bri * 100 / 254);
				sliders[index-3].value = val;
				values_sliders[index-3].innerText = val;

			}
		}
		
	}
}

for(i=0;i<cbx.length;i++){
	cbx[i].onclick = function() {
		var data = {};
		if(this.checked){
			//On donne comme consigne d'allumer la lampe / la pièce
			data.on = true;
		}else{
			//On donne comme consigne d'éteindre la lampe / la pièce
			data.on = false;
		}
		if(this.getAttribute("light-id") != null){
			light_id = this.getAttribute("light-id");		
			ChangePhilipsHueState(data, light_id);
		}else if(this.getAttribute("group-id")!= null){
			group_id = this.getAttribute("group-id");
			ChangePhilipsHueGroupsState(data, group_id);
		}
		
	}
	
}

for (var i = sliders.length - 1; i >= 0; i--) {
	sliders[i].onchange = function(){
		slider = this;
		val = slider.value;
		light_id = slider.getAttribute("light-id");
		values_sliders[light_id-3].innerText = val;

		var data = {};
		data.on = true;
		data.bri	= parseInt(254* parseInt(val)/100);

		ChangePhilipsHueState(data, light_id);
		cbx[light_id-3].checked = true;
	}

}

setInterval(function(){ updateLightsState(); }, 5000);