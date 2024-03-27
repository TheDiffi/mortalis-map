import mapboxgl from "mapbox-gl";
import { generateMarkerLayerButtons } from "./markers/markers";
import { updateStyle, setupStyle } from "./common/styles";
import loadMapControls from "./common/loadMapControls";

const markerLayers = [
	{
		type: "marker",
		style: "symbol",
		symbol: "marker-sb-1",
		layerName: "markers1",
	},
	{
		type: "session",
		style: "symbol",
		symbol: "marker-sb-1",
		layerName: "markers2",
	},
];

const controls = {};
var currentStylename = "Normal";

const map = new mapboxgl.Map({
	accessToken: "pk.eyJ1IjoidGhlZGlmZmkiLCJhIjoiY2xjeGpuYm92MjN4cjNybXNremFtMHd3aiJ9.8QG0LO8bSAfYA0zROCmEmQ",
	container: "map", // container ID
	style: "mapbox://styles/thediffi/cld7hz283000j01ockqljc73u", // style URL
	center: [0.02, -0.02], // starting position [lng, lat]
	zoom: 15.5, // starting zoom
	projection: "mercator",
	minZoom: 14,
	pitch: 25,
});

map.on("load", function () {
	// render map controls
	loadMapControls(map, controls);
	generateMarkerLayerButtons();

	//setup the style
	setupStyle(map, currentStylename, changeStyle);

	test();
});

function test() {}

function setLayerVisibility(layer, checked) {
	console.log("updating layer visibility: " + layer + " " + checked);
	if (checked) {
		map.setLayoutProperty(layer, "visibility", "visible");
	} else {
		map.setLayoutProperty(layer, "visibility", "none");
	}
}

function changeStyle(map, stylename) {
	console.log("changing style to: " + stylename);
	currentStylename = stylename;
	updateStyle(map, stylename);
}

document.getElementById("toggle-sidebar").addEventListener("click", toggleSidebar);
function toggleSidebar() {
	document.getElementById("sidebar").classList.toggle("disabled");
}

export { markerLayers, map, changeStyle, setLayerVisibility };
