import mapboxgl from "mapbox-gl";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { markerLayers } from ".";

export function loadPopups(map) {
	// create a list of all the marker layer names
	const markerLayerNames = markerLayers.reduce((acc, marker) => {
		acc.push(marker.layerName);
		return acc;
	}, []);
	var popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false,
	});

	// Change the cursor to a pointer when the mouse is over the places layer.
	map.on("mouseenter", markerLayerNames.concat(["cities_layer"]), (e) => {
		map.getCanvas().style.cursor = "pointer";
		popup = popups(e, map);
	});

	// Change it back to a pointer when it leaves.
	map.on("mouseleave", markerLayerNames.concat(["cities_layer"]), function () {
		map.getCanvas().style.cursor = "grab";
		if(popup) popup.remove();
	});

	// open the content in the sidebar when a town is clicked
	map.on("click", "cities_layer", function (e) {
		townsOnClick(e, map);
	});

	// open the content in the sidebar when a marker is clicked
	map.on("click", markerLayerNames, function (e) {
		markersOnClick(e);
	});
}

function markersOnClick(e) {
	var content = DOMPurify.sanitize(marked.parse(e.features[0].properties.content ?? ""));
	if(content === "") content = "No information available";
	document.getElementById("sidebar-content").innerHTML = content;
	console.log(content)
}

function townsOnClick(e, map) {
	
	console.log("town clicked");
	map.flyTo({
		center: e.features[0].geometry.coordinates,
		duration: 1000,
		curve: 2,
		pitch: 25,
	});

	var content = parseContent(e.features[0].properties.Name, e.features[0].properties.description);
	if(content === "") content = "No information available for this town.";
	document.getElementById("sidebar-content").innerHTML = content;
	
}

export function popups(e, map) {
	if (!e.features[0].properties.popup) return;
	// Copy coordinates array.
	var coordinates = e.features[0].geometry.coordinates.slice();

	//parses the Content
	var popupContent = "";
	if (e.features[0].properties.type === "marker") {
		popupContent = DOMPurify.sanitize(marked.parse(e.features[0].properties.popup_content ?? ""));
	} else if (e.features[0].layer.id === "cities_layer") {
		var name = e.features[0].properties.Name;
		var info = e.features[0].properties.description;
		popupContent = parseContent(name, info);
	}

	popupMath(e, coordinates);

	/// Populate the popup and set its coordinates
	// based on the feature found.
	return new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false,
	})
		.setLngLat(coordinates)
		.setHTML(popupContent)
		.addTo(map);
}

export function popupMath(e, coordinates2) {
	// Ensure that if the map is zoomed out such that multiple
	// copies of the feature are visible, the popup appears
	// over the copy being pointed to.
	while (Math.abs(e.lngLat.lng - coordinates2[0]) > 180) {
		coordinates2[0] += e.lngLat.lng > coordinates2[0] ? 360 : -360;
	}
}

export function parseContent(name, info) {
	var parsed = "";
	parsed = "<h2 style='padding-bottom: 5px;'>" + name + "</h2><hr>" ?? "";
	parsed += "<p>"+ info + "</p>" ?? "";
	return parsed;
}