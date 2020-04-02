
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

row = document.getElementsByClassName('row');

function updateStates(T = false){
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername;
	xhr.open("GET", url, true);
	xhr.send();
	xhr.onload = function(){
		if(xhr.status == 200){
			data = JSON.parse(xhr.response);

			for(var id in data.lights){
				if(T){
					row[0].innerHTML += '<div class="inferface-item card" light-id="'+id+'"><span class="interface-title"></span><input type="checkbox" id="cbx1" class="cbx" style="display:none"/><label for="cbx1" class="toggle"><span></span></label><div class="slidecontainer">  <input type="range" min="1" max="100" value="50" class="slider">  <span class="value-slider"></span></div></div>';
				}
				that = document.querySelector('[light-id="'+id+'"]');
				if(data.lights[id].state.on){
					that.getElementsByClassName("cbx")[0].checked = true;
				}else{
					that.getElementsByClassName("cbx")[0].checked = false;
				}
				if(T){
					that.getElementsByTagName("span")[0].innerText = data.lights[id].name
				}
				val= parseInt(data.lights[id].state.bri * 100 / 254);
				that.getElementsByClassName("slider")[0].value = val;
				that.getElementsByClassName('value-slider')[0].innerText = val;
			}
		
			for(var id in data.groups){

				if(T){
					row[1].innerHTML += '<div class="inferface-item card" group-id="'+id+'"><span class="interface-title"></span><input type="checkbox" class="cbx" style="display:none"/><label class="toggle"><span></span></label><div class="slidecontainer"><input type="range" min="1" max="100" value="50" class="slider"><span class="value-slider"></span></div></div>';
				}
				that = document.querySelector('[group-id="'+id+'"]');
				if(data.groups[id].state.all_on){
					that.getElementsByClassName("cbx")[0].checked = true;
				}else{
					that.getElementsByClassName("cbx")[0].checked = false;
				}
				if(T){
					that.getElementsByTagName("span")[0].innerText = data.groups[id].name
				}
				val= parseInt(data.groups[id].action.bri * 100 / 254);
				that.getElementsByClassName("slider")[0].value = val;
				that.getElementsByClassName('value-slider')[0].innerText = val;
			}
			if(T){
				addEventListenerOnCheckBoxesAndSliders();
			}
		}
	}
	
}

updateStates(true);

cbx = document.getElementsByClassName("cbx");
sliders = document.getElementsByClassName("slider");
values_sliders = document.getElementsByClassName('value-slider');

function addEventListenerOnCheckBoxesAndSliders(){
	$labels = document.getElementsByTagName('label');
	for (var i = 0; i < $labels.length; i++) {
		$labels[i].onclick = function() {
			$card = this.parentElement;
			$cbx = $card.getElementsByClassName('cbx')[0];
			var data = {};
			if(!$cbx.checked){
				//On donne comme consigne d'allumer la lampe / la pièce
				data.on = true;
			}else{
				//On donne comme consigne d'éteindre la lampe / la pièce
				data.on = false;
			}
			if($card.getAttribute("light-id") != null){
				light_id = $card.getAttribute("light-id");		
				ChangePhilipsHueState(data, light_id);
			}else{
				group_id = $card.getAttribute("group-id");
				ChangePhilipsHueGroupsState(data, group_id);
			}
			
		}
	}
	$sliders = document.getElementsByClassName("slider");
	for (var i = $sliders.length - 1; i >= 0; i--) {
		$sliders[i].onchange = function(){
			$card = this.parentElement.parentElement;
			$cbx = $card.getElementsByClassName('cbx')[0]
			val = this.value;
			$card.getElementsByClassName('value-slider')[0].innerText = val;

			var data = {};
			data.on = true;
			data.bri = parseInt(254* parseInt(val)/100);

			if($card.getAttribute("light-id") != null){
				light_id = $card.getAttribute("light-id");		
				ChangePhilipsHueState(data, light_id);
			}else{
				group_id = $card.getAttribute("group-id");
				ChangePhilipsHueGroupsState(data, group_id);
			}

			$card.getElementsByClassName('cbx')[0]
			$cbx.checked = true;
		}

	}
}
	



setInterval(function(){ updateStates(); }, 5000);