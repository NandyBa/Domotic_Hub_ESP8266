
function ChangePhilipsHueState(data, light_id){
	let location = "/lights/"+light_id+"/state";
	ChangeState(data, location);
}

function ChangePhilipsHueGroupsState(data, group_id){
	let location = "groups/"+group_id+"/action";
	ChangeState(data, location);
}

function ChangeState(data, location){
	var json = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	var url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/"+location;
	xhr.open("PUT", url, true);
	xhr.send(json);
}

row = document.getElementsByClassName('row');

function updateStates(First_update = false){
	updateLightStates(First_update);
	updateGroupsLightStates(First_update);
	if(First_update){
		addEventListenerOnCheckBoxesAndSliders();
	}
}

function updateLightStates(First_update = false){

	PhilipsHueHttpRequest('lights').then(data => {

		for(var id in data){
			if(First_update){
				row[0].innerHTML += '<div class="inferface-item card" light-id="'+id+'"><span class="interface-title"></span><input type="checkbox" id="cbx1" class="cbx" style="display:none"/><label for="cbx1" class="toggle"><span></span></label><div class="slidecontainer">  <input type="range" min="1" max="100" value="50" class="slider">  <span class="value-slider"></span></div></div>';
			}
			that = document.querySelector('[light-id="'+id+'"]');
			if(data[id].state.on){
				that.getElementsByClassName("cbx")[0].checked = true;
			}else{
				that.getElementsByClassName("cbx")[0].checked = false;
			}
			if(First_update){
				that.getElementsByTagName("span")[0].innerText = data[id].name
			}
			val= parseInt(data[id].state.bri * 100 / 254);
			that.getElementsByClassName("slider")[0].value = val;
			that.getElementsByClassName('value-slider')[0].innerText = val;
		}
	});
}


function updateGroupsLightStates(First_update = false){

	PhilipsHueHttpRequest('groups').then(data => {

		for(var id in data){

			if(First_update){
				row[1].innerHTML += '<div class="inferface-item card" group-id="'+id+'"><span class="interface-title"></span><input type="checkbox" class="cbx" style="display:none"/><label class="toggle"><span></span></label><div class="slidecontainer"><input type="range" min="1" max="100" value="50" class="slider"><span class="value-slider"></span></div></div>';
			}
			that = document.querySelector('[group-id="'+id+'"]');
			if(data[id].state.all_on){
				that.getElementsByClassName("cbx")[0].checked = true;
			}else{
				that.getElementsByClassName("cbx")[0].checked = false;
			}
			if(First_update){
				that.getElementsByTagName("span")[0].innerText = data[id].name
			}
			val= parseInt(data[id].action.bri * 100 / 254);
			that.getElementsByClassName("slider")[0].value = val;
			that.getElementsByClassName('value-slider')[0].innerText = val;
		}
		if(First_update){
			addEventListenerOnCheckBoxesAndSliders();
		}
	});

	
}

function PhilipsHueHttpRequest(location){
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		let url = "http://"+globalConfig.PhilipsHubIp+"/api/"+globalConfig.PhilipsUsername+"/"+location;
		xhr.open("GET", url, true);
		xhr.send();
		xhr.onload = () => {
			if(xhr.status == 200){
				data = JSON.parse(xhr.response);
				resolve(data);
			}
		}
	});
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
				$cbx.checked = true; //On coche directement la case, pour amener de la fluidité à l'interface graphique
			}else{
				//On donne comme consigne d'éteindre la lampe / la pièce
				data.on = false;
				$cbx.checked = false; //On décoche directement la case, pour amener de la fluidité à l'interface graphique
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
				$cbx.checked = true;
				light_id = $card.getAttribute("light-id");		
				ChangePhilipsHueState(data, light_id);
			}else{
				$cbx.checked = true;
				group_id = $card.getAttribute("group-id");
				ChangePhilipsHueGroupsState(data, group_id);
			}

			$card.getElementsByClassName('cbx')[0]
		}

	}
}
	



setInterval(function(){ updateStates(); }, 5000);