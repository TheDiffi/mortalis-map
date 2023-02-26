import { loadPopups } from "./popups";
import featuresJson from "../assets/geo/iwd_features.json";
import { loadAllMarkers, updateMarkerLayersVisibility } from "./markers";

export function setupStyle(map, stylename) {
	console.log("Setting up style: " + stylename);
	// render the layers
	switch (stylename) {
		case "Player":
			setupStylePlayer(map);
			break;
		default:
			setupStyleNormal(map);
	}

	loadAllMarkers(map);
	updateMarkerLayersVisibility();
}

export function updateStyle(map, stylename) {
	console.log("Updating style: " + stylename);
	map.once("style.load", function () {
		console.log("style loaded");
		setupStyle(map, stylename);
	});
}

function setupStyleNormal(map) {
	console.log("Loading Sources: Normal");
	try {
		// loads all features -> features
		map.addSource("features", {
			type: "geojson",
			data: featuresJson,
		});
	} catch (error) {
		console.log("features source already loaded" + error);
	}

	console.log("Rendering layers: Normal");
	// loads the 3d terrain
	addDEM(map);
	// Add daytime fog
	addFog(map);

	// renders the towns layer
	loadTowns(map);

	// Create a popup, but don't add it to the map yet.
	loadPopups(map);
}

function setupStylePlayer(map) {
	console.log("rendering player layers");
	// loads the 3d terrain
	addDEM(map);
	// Add daytime fog
	addFog(map);
}

export function addDEM(map) {
	try {
		// loads the DEM source -> dem
		map.addSource("dem", {
			type: "raster-dem",
			url: "mapbox://thediffi.c0q45d6q",
		});
	} catch (error) {
		console.log("DEM source already loaded" + error);
	}

	// add the DEM source as a terrain layer with exaggerated height
	map.setTerrain({ source: "dem", exaggeration: 0.0001 });
	console.log("terrain added");
}

export function addFog(map) {
	map.setFog({
		range: [-1, 5],
		"horizon-blend": 0.2,
		color: "white",
		"high-color": "#add8e6",
		"space-color": "#d8f2ff",
		"star-intensity": 0.0,
	});
}

function loadTowns(map) {
	// layers are the visual representation of the data
	console.log("Loading Towns Layer");

	map.addLayer({
		id: "cities_layer",
		type: "circle",
		source: "features",
		//filters out the features that are not towns
		filter: [
			"any",
			["==", ["get", "type"], "city_b"],
			["==", ["get", "type"], "city_s"],
			["==", ["get", "type"], "city_m"],
		],
		layout: {
			visibility: "visible",
			//allow overlap
		},
		paint: {
			"circle-radius": 15,
			"circle-opacity": 0,
		},
	});
}
