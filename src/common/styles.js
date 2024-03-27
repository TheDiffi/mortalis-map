import { loadPopups } from "../popups";
import featuresJson from "../../assets/geo/iwd_features.json";

const loadDem = false;

/**
 * @param {mapboxgl.Map} mapbox
 * @param {String} stylename
 * @param {MarkerManager} markerManager
 */
export function setupStyle(mapbox, stylename, markerManager) {
	console.log("mapbox: ", mapbox);

	console.log("Setting up style: " + stylename);
	// render the layers
	switch (stylename) {
		case "Player":
			setupStylePlayer(mapbox, loadDem);
			break;
		default:
			setupStyleNormal(mapbox, loadDem);
	}

	markerManager.loadAllMarkers(mapbox);
	markerManager.updateMarkerLayersVisibility();
}

function setupStyleNormal(mapbox, loadDem) {
	console.log("Loading Sources: Normal");
	try {
		// loads all features -> features
		mapbox.addSource("features", {
			type: "geojson",
			data: featuresJson,
		});
	} catch (error) {
		console.log("features source already loaded" + error);
	}

	console.log("Rendering layers: Normal");
	// loads the 3d terrain
	if (loadDem) addDEM(mapbox);
	// Add daytime fog
	addFog(mapbox);

	// renders the towns layer
	loadTowns(mapbox);

	// Create a popup, but don't add it to the map yet.
	loadPopups(mapbox);
}

/**
 * loads the player map style
 * @param {mapboxgl.Map} mapbox
 * @param {boolean} loadDem
 */
function setupStylePlayer(mapbox, loadDem) {
	console.log("rendering player layers");
	// loads the 3d terrain
	if (loadDem) addDEM(mapbox);
	// Add daytime fog
	addFog(mapbox);
}

export function addDEM(mapbox) {
	try {
		// loads the DEM source -> dem
		mapbox.addSource("dem", {
			type: "raster-dem",
			url: "mapbox://thediffi.2pvcnilz",
		});
	} catch (error) {
		console.log("DEM source already loaded" + error);
	}

	// add the DEM source as a terrain layer with exaggerated height
	mapbox.setTerrain({ source: "dem", exaggeration: 0.0005 });
	console.log("terrain added");
}

export function addFog(mapbox) {
	mapbox.setFog({
		range: [-1, 5],
		"horizon-blend": 0.2,
		color: "white",
		"high-color": "#add8e6",
		"space-color": "#d8f2ff",
		"star-intensity": 0.0,
	});
}

function loadTowns(mapbox) {
	// layers are the visual representation of the data
	console.log("Loading Towns Layer");

	mapbox.addLayer({
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
