import mapboxgl from "mapbox-gl";
import { setupStyle } from "./styles";
import loadMapControls from "./loadMapControls";
import MarkerManager from "./markers/markerManager";

class MapManager {
	controls = {};
	currentStylename = "Normal";

	constructor() {
		// create the map
		this.mapbox = new mapboxgl.Map({
			accessToken: "pk.eyJ1IjoidGhlZGlmZmkiLCJhIjoiY2xjeGpuYm92MjN4cjNybXNremFtMHd3aiJ9.8QG0LO8bSAfYA0zROCmEmQ",
			container: "map", // container ID
			style: "mapbox://styles/thediffi/cld7hz283000j01ockqljc73u", // style URL
			center: [0.02, -0.02], // starting position [lng, lat]
			zoom: 15.5, // starting zoom
			projection: "mercator",
			minZoom: 14,
			pitch: 25,
		});

		this.mapbox.on("load", () => {
			this.initMap();
		});

		console.log("mapbox: ", this.mapbox);
	}

	initMap = () => {
		// render map controls
		loadMapControls(this.mapbox, this.controls, this.changeStyle);

		this.markerManager = new MarkerManager(this);
		this.markerManager.generateMarkerLayerButtons();

		setupStyle(this.mapbox, this.currentStylename, this.markerManager);
	};

	setLayerVisibility = (layer, checked) => {
		console.log("updating layer visibility: " + layer + " " + checked);
		const visibility = checked ? "visible" : "none";
		this.mapbox.setLayoutProperty(layer, "visibility", visibility);
	};

	changeStyle = (stylename) => {
		console.log("changing style to: " + stylename);
		this.currentStylename = stylename;

		this.mapbox.once("style.load", () => {
			console.log("style loaded");
			console.log("mapbox: ", this.mapbox);

			setupStyle(this.mapbox, this.currentStylename, this.markerManager);
		});
	};
}

export default MapManager;
