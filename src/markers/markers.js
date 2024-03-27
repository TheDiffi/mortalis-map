import markerJson from "../../assets/geo/markers.json";
import * as Map from "../index";

//generate a button for each marker layer
export function generateMarkerLayerButtons() {
	const markerInputs = document.getElementById("marker-input-container");

	Map.markerLayers.forEach((layer) => {
		const button = document.createElement("button");
		button.innerText = layer.type;
		button.value = layer.layerName;
		button.classList.add("map-element-marker-button");
		button.addEventListener("click", () => {
			button.classList.toggle("active");
			Map.setLayerVisibility(layer.layerName, isActive(button));
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
			Map.setLayerVisibility(btn.value, isActive(btn));
		} catch (error) {
			console.log("LayerVisibilityError: " + error);
		}
	});
}

/**

 * @param {mapboxgl.Map} map
 * 
 */
export function loadAllMarkers(map) {
	console.log("Loading all markers");
	loadMarkerSymbols(map);
	Map.markerLayers.forEach((layer) => {
		console.log("Loading marker layer: " + layer.type);
		loadMarkerLayer(map, layer);
	});
}

function loadMarkerLayer(map, layer) {
	// loads just the markers from the features -> markers
	const actualMarkers = filterMarkersByType(markerJson, layer.type);
	map.addSource(layer.layerName, {
		type: "geojson",
		data: actualMarkers,
	});
	console.log("MarkerJSon: " + layer.type);
	console.log(actualMarkers);
	switch (layer.style) {
		case "symbol":
			map.addLayer({
				id: layer.layerName,
				type: layer.style,
				source: layer.layerName,
				layout: {
					"icon-image": layer.symbol,
				},
			});
			break;
		case "circle":
		default:
			map.addLayer({
				id: layer.layerName,
				type: layer.style,
				source: layer.layerName,
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

/**
 * filters a geojson by type
 * @param {JSON} geojson
 * @param {String} type
 */
function filterMarkersByType(geojson, type) {
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
