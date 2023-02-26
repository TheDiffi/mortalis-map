import markerJson from "../assets/geo/markers.json";
import { markerLayers, setLayerVisibility } from "./index";

//generate a input for each marker
export function generateMarkerInputs() {
	const markerInputs = document.getElementById("marker-input-container");

	markerLayers.forEach((marker) => {
		const div = document.createElement("div");
		const input = document.createElement("input");
		input.type = "checkbox";
		input.name = marker.type;
		input.value = marker.layerName;
		input.checked = false;
		input.addEventListener("change", () => {
			updateMarkerLayersVisibility();
		});

		const label = document.createElement("label");
		label.htmlFor = marker.type;
		label.appendChild(document.createTextNode(marker.type));

		div.className = "marker-input-element";
		div.appendChild(input);
		div.appendChild(label);

		markerInputs.appendChild(div);
	});
}

export function updateMarkerLayersVisibility() {
	console.log("Loading checked layers");
	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	checkboxes.forEach(function (box) {
		try {
			setLayerVisibility(box.value, box.checked);
		} catch (error) {
			console.log("LayerVisibilityError: " + error);
		}
	});
}

export function loadAllMarkers(map) {
	console.log("Loading all markers");
	loadMarkerSymbols(map);
	markerLayers.forEach((markerOptions) => {
		console.log("Loading marker: " + markerOptions.type);
		loadMarker(map, markerOptions);
	});
}

function loadMarker(map, marker) {
	// loads just the markers from the features -> markers
	const actualMarkers = filterJsonType(markerJson, marker.type);
	map.addSource(marker.layerName, {
		type: "geojson",
		data: actualMarkers,
	});
	console.log("MarkerJSon: " + marker.type);
	console.log(actualMarkers);
	switch (marker.style) {
		case "symbol":
			map.addLayer({
				id: marker.layerName,
				type: marker.style,
				source: marker.layerName,
				layout: {
					"icon-image": marker.symbol,
				},
			});
			break;
		case "circle":
		default:
			map.addLayer({
				id: marker.layerName,
				type: marker.style,
				source: marker.layerName,
				layout: {},
			});
			break;
	}
}

function loadMarkerSymbols(map) {
	try {
		map.loadImage("https://img.icons8.com/material-rounded/24/null/location-marker.png", (error, image) => {
			if (error) throw error;
			map.addImage("marker-sb-1", image);
		});
	} catch (error) {
		console.log("MarkerSymbolsError: " + error);
	}
}

function filterJsonType(geojson, type) {
	const newJson = {
		type: "FeatureCollection",
		features: [],
	};
	geojson.features.forEach((feature) => {
		//filter out all of type marker
		if (feature.properties.type === type) {
			//save it in acutalMarkers
			newJson.features.push(feature);
		}
	});
	return newJson;
}
