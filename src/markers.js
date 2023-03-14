import markerJson from "../assets/geo/markers.json";
import { markerLayers, setLayerVisibility } from "./index";

//generate a input for each marker
export function generateMarkerInputs() {
	const markerInputs = document.getElementById("marker-input-container");

	markerLayers.forEach((marker) => {
		const button = document.createElement("button");
		button.innerText = marker.type;
		button.value = marker.layerName;
		button.classList.add("map-element-marker-button");
		button.addEventListener("click", () => {
			button.classList.toggle("active");
			setLayerVisibility(marker.layerName, isActive(button));
		});
		markerInputs.appendChild(button);
	});


}

function isActive(node) {
	return node.classList.contains("active");
}

export function updateMarkerLayersVisibility() {
	console.log("Loading checked layers");
	const inputGroup = document.getElementById("marker-input-container");
	inputGroup.childNodes.forEach((btn) => {
		try {
			setLayerVisibility(btn.value, isActive(btn));
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
