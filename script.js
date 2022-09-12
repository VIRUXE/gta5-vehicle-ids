const vehiclesTable = document.getElementById("vehicles");
const tableRows = vehiclesTable.rows;

// Populate the table with vehicles first
fetch("vehicles.json")
  .then(response => response.json())
  .then(data => 
	data.forEach(function(vehicle) {
		var newRow = document.createElement('tr');
	
		newRow.innerHTML = 
			'<td ondblclick="copyToClipboard(this)" title="Double-click to Copy to Clipboard">' + vehicle.id + '</td>' +
			'<td>' + vehicle.name + '</td>' +
			'<td>' + vehicle.category + '</td>' +
			'<td>' + vehicle.dlc + '</td>';
	
		vehiclesTable.appendChild(newRow);
	})
);

// Set the color in the Category and DLC columns
for (let row = 1; row < tableRows.length; row++) {
	const rowCells = tableRows[row].getElementsByTagName("td");
	const category = rowCells[2];
	const dlc      = rowCells[3];
	
	if (category?.innerText === "Undefined")
		category.style.color = "darkgrey";
	
	if (dlc?.innerText === "Undefined")
		dlc.style.color = "darkgrey";
}

// The actual search function
function search() {
	const query = document.getElementById("query").value.toUpperCase();

	for (let row = 1; row < tableRows.length; row++) {
		const vehicleName = tableRows[row].getElementsByTagName("td")[1];

		if (vehicleName) {
			const txtValue = vehicleName.textContent || vehicleName.innerText;

			tableRows[row].style.display = txtValue.toUpperCase().indexOf(query) > -1 ? "" : "none";
		}
	}
}

// Delete the entire query value when Backspace is used
document.getElementById("query").onkeydown = e => {
	if (e.key === "Backspace")
		document.getElementById("query").value = null;
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