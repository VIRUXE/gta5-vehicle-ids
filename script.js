const vehiclesTable = document.getElementById("vehicles");
const tableRows = vehiclesTable.rows;

// Populate the table with vehicles first
fetch("https://raw.githubusercontent.com/VIRUXE/gta5-vehicle-metadata/main/vehicles.json")
	.then(response => response.json())
	.then(vehicles => {
		const vehicleModels = Object.keys(vehicles);

		vehicleModels.forEach(model => {
			const vehicle         = vehicles[model];
			const vehicleName     = vehicle.name || model
			let   vehicleRealName = vehicle.realname || "";
			const vehicleClass    = vehicle.class || "";
			let   vehicleDLC      = vehicle.dlc || "";

			if (vehicle.realname !== undefined) {
				// If there's multiple real names (seperated by either a comma, a / or ;) add a span and make their font size smaller
				if (vehicle.realname.includes(',') || vehicle.realname.includes('/') || vehicle.realname.includes(';')) {
					// Split the string by either a comma, a / or a ;
					const realNames = vehicle.realname.split(/[,/;]/);
					// Add the number of real names inside a sup tag
					vehicleRealName = `<sup>${realNames.length}</sup> `;

					// Make the font size smaller for each real name (besides the first one), using inline styles withing the span
					vehicleRealName += realNames.map((realName, index) => {
						if (index === 0) return realName;

						const fontSize = 1.0 - (index * 0.1);
						return `<span style="font-size: ${fontSize}em">${realName}</span>`;
					}).join(', ');
				}
			}
			
			if (vehicle.dlc !== undefined) {
				const dlcLabels = { // https://gist.github.com/VIRUXE/d9eb9e3dee9919928a989afc23d9ee48
					'mpbeach'          : 'Beach Bum',
					'mpvalentines'     : 'Valentine\'s Day Massacre',
					'mpbusiness'       : 'Business',
					'mpbusiness2'      : 'High Life',
					'mphipster'        : 'I\'m Not A Hipster',
					'mpindependence'   : 'Independence Day',
					'mppilot'          : 'San Andreas Flight School',
					'mplts'            : 'Last Team Standing',
					'mpchristmas2'     : 'Festive Surprise',
					'mpheist'          : 'Heists',
					'mpluxe'           : 'Ill-Gotten Gains',
					'mpluxe2'          : 'Ill-Gotten Gains',
					'mploweriders'     : 'Lowriders',
					'mphalloween'      : 'Halloween Surprise',
					'mpapartment'      : 'Executives and Other Criminals',
					'mpxmas_604490'    : 'Festive Surprise 2015',
					'mpjanuary2016'    : 'January 2016',
					'mpvalentines2'    : 'Be My Valentine',
					'mplowrider2'      : 'Lowriders: Custom Classics',
					'mpexecutive'      : 'Further Adventures in Finance and Felony',
					'mpstunt'          : 'Cunning Stunts',
					'mpbiker'          : 'Bikers',
					'mpimportexport'   : 'Import/Export',
					'mpspecialraces'   : 'Cunning Stunts: Special Vehicle Circuit',
					'mpgunrunning'     : 'Gunrunning',
					'mpsmuggler'       : 'Smuggler\'s Run',
					'mpchristmas2017'  : 'The Doomsday Heist',
					'mpassault'        : 'Southern San Andreas Super Sport Series',
					'mpbattle'         : 'After Hours',
					'mpchristmas2018'  : 'Arena War',
					'mpvinewood'       : 'The Diamond Casino & Resort',
					'mpheist3'         : 'The Diamond Casino Heist',
					'mpsum'            : 'Los Santos Summer Special',
					'mpheist4'         : 'The Cayo Perico Heist',
					'mptuner'          : 'Los Santos Tuners',
					'mpsecurity'       : 'The Contract',
					'mpsum2'           : 'The Criminal Enterprises',
					'mpsum2_g9ec'      : 'The Criminal Enterprises',
					'mpchristmas3'     : 'Los Santos Drug Wars',
					'mpchristmas3_g9ec': 'Los Santos Drug Wars',
					'spupgrade'        : 'Single Player Upgrade'
				};
				
				if (dlcLabels[vehicle.dlc] !== undefined) vehicleDLC = `${dlcLabels[vehicle.dlc]} <span>${vehicle.dlc}</span>`;
			}
			

			let newRow = document.createElement('tr');
			newRow.innerHTML = `
			<td ondblclick="copyToClipboard(this)" title="Double-click to Copy to Clipboard">${model}</td>
			<td><a href="https://gtacars.net/gta5/${model}" target="_blank">${vehicleName}</a></td>
			<td>${vehicleRealName}</td>
			<td>${vehicleClass}</td>
			<td>${vehicleDLC}</td>
			`;

			vehiclesTable.appendChild(newRow);
		});
		
		// On hovering the first td in the table, show an iframe using the href as the source
		document.querySelectorAll("#vehicles tr td:first-child").forEach(function(td) {
			td.addEventListener("mouseover", function() {
				const vehicleName = td.innerText.toLowerCase();
				const vehicle = vehicles[vehicleName]; // Get the vehicle object from the vehicles object, using the model as the key
				
				let markup = ``;
				
				// Create markup for each value in the vehicle object
				let columns = 0;
				Object.keys(vehicle).forEach(function(key) {
					// Don't add values that are on the table
					if (key === "model" || key === "name" || key === "realname" || key === "class" || key === "dlc") return;

					const property = key.charAt(0).toUpperCase() + key.slice(1);
					const value = vehicle[key];
					
					if (key === "price") {
						markup += `<span>${property}</span>: $${value.toLocaleString()}<br>`;
					} else if (key === "weight") {
						markup += `<span>${property}</span>: ${value}KG<br>`;
					} else if (key === "ranking") {
						markup += `<span>${property}</span>: ${value}★<br>`;
					} else if (key === "image") {
						// Try to load the local image first and if that fails try to load the image from the url
						markup += `<div><img src="images/${vehicleName}.jpg" onerror="this.onerror=null;this.src='https://gtabase.com${value}';" alt="${vehicleName}"></div>`;
					} else {
						markup += `<span>${property}</span>: ${value}<br>`;
					}
					// Capitalize the first letter of the property
					columns++;
				});
				
				// If there are no values, don't show the div
				if (columns === 0) {
					document.getElementById("vehicle-info").style.display = "none";
					return;
				}

				const vehicleInfo = document.getElementById("vehicle-info");

				vehicleInfo.innerHTML = markup;
				vehicleInfo.style.display = "block";

				// Now we move the div to where the mouse is
				vehicleInfo.style.left = event.pageX + 10 + "px";
				vehicleInfo.style.top = event.pageY + 10 + "px";
			});

			td.addEventListener("mouseout", function() {
				document.getElementById("vehicle-info").style.display = "none";
			});
		});
	}
);

function toggleRow(row, bool) {
	// If the row is hidden, show it
	if (bool) {
		tableRows[row].style.display = "";
		const interval = setInterval(() => {
			let opacity = tableRows[row].style.opacity;
			opacity = opacity === "" ? 0 : opacity;
			opacity = parseFloat(opacity);
			opacity += 0.1;
			tableRows[row].style.opacity = opacity;
			if (opacity >= 1) {
				clearInterval(interval);
			}
		}, 80);
	} else {
		// Gradually lower the opacity of the row
		let opacity = 1;
		const interval = setInterval(() => {
			opacity -= 0.1;
			tableRows[row].style.opacity = opacity;
			if (opacity <= 0) {
				clearInterval(interval);

				// Hide the row
				tableRows[row].style.display = "none";
				// tableRows[row].style.opacity = 1;
			}
		}, 80);
	}
}

// The actual search function
function search() {
	const query = document.getElementById("query").value.toLowerCase();

	for (let row = 1; row < tableRows.length; row++) {
		// Show or hide the row based on the query
		toggleRow(row, tableRows[row].innerText.toLowerCase().indexOf(query) > -1);
	}
}

// Delete the entire query value when Backspace is used
document.getElementById("query").onkeydown = e => {
	if (e.key === "Backspace")
		document.getElementById("query").value = null;
}
// Clear the search when the user clicks on the search bar
document.getElementById("query").onclick = () => {
	document.getElementById("query").value = null;
}

// Show all the rows again when we click on the X button
document.getElementById("query").onsearch = () => {
	for (let row = 1; row < tableRows.length; row++) {
		toggleRow(row, true);
	}
}

// Copy the ID to clipboard - Only works with https
function copyToClipboard(element) {
	let value = element.innerText;
	
	navigator.clipboard.writeText(value).then(() => {
		alert("Copied " + value);
	}, () => {
		alert("Unable to copy. Not using HTTPS protocol.");
	});
}
