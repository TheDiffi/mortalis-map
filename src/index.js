import mapboxgl from "mapbox-gl";
import { RulerControl } from "mapbox-gl-controls";
import { generateMarkerInputs } from "./markers";
import { updateStyle, setupStyle } from "./styles";
import StylesSwitcher from "./stylesSwitcher";
export const styles = [
	{
		label: "Normal",
		styleName: "Normal",
		styleUrl: "mapbox://styles/thediffi/cld7hz283000j01ockqljc73u",
	},
	{
		label: "Player",
		styleName: "Player",
		styleUrl: "mapbox://styles/thediffi/cleizzrd3000601nvl3tlp6q3",
	},
];

export const markerLayers = [
	{
		type: "marker",
		style: "symbol",
		symbol: "marker-sb-1",
		layerName: "markers1",
	},
	{
		type: "session",
		style: "circle",
		symbol: "marker-sb-1",
		layerName: "markers2",
	},
];

const controls = {};

var currentStylename = "Normal";
const switchToFeetZoomLevel = 15;

export const map = new mapboxgl.Map({
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
	loadMapControls(map);
	generateMarkerInputs();

	//setup the style
	setupStyle(map, currentStylename);

	test();
});

function loadMapControls() {
	// with custom styles:
	loadStyleSwitcher();

	loadRulerControl();

	function loadStyleSwitcher() {
		const styleSwitcher = new StylesSwitcher({
			styles: styles,
			onChange: (style) => changeStyle(map, style.label),
		});

		// removes existing style switcher
		if ("styleSwitcher" in controls) {
			map.removeControl(controls["styleSwitcher"]);
			delete controls["styleSwitcher"];
		}

		map.addControl(styleSwitcher, "bottom-right");
		controls["styleSwitcher"] = styleSwitcher;
	}

	function loadRulerControl() {
		const ruler = new RulerControl({
			labelFormat: function formatRulerLength(n) {
				switch (map.getZoom() < switchToFeetZoomLevel) {
					case true:
						return `${n.toFixed(2) * 16} miles`;
					case false:
						return `${n.toFixed(2) * 16} feet`;
					default:
						console.warn(
							"Warning: In Ruler Control, mapZoom is neither smaller nor bigger than constant value"
						);
						return `${n.toFixed(2) * 16} miles`;
				}
			},
		});

		//removes an existing ruler
		if ("ruler" in controls) {
			map.removeControl(controls["ruler"]);
			delete controls["ruler"];
		}

		//adds the new control
		map.addControl(ruler, "top-right");
		controls["ruler"] = ruler;

		map.on("ruler.on", () => console.log("ruler: on"));
		map.on("ruler.off", () => console.log("ruler: off"));
	}
}

function changeStyle(map, stylename) {
	console.log("changing style to: " + stylename);
	currentStylename = stylename;
	updateStyle(map, stylename);
}

export function setLayerVisibility(layer, checked) {
	console.log("updating layer visibility: " + layer + " " + checked);
	if (checked) {
		map.setLayoutProperty(layer, "visibility", "visible");
	} else {
		map.setLayoutProperty(layer, "visibility", "none");
	}
}

document.getElementById("toggle-sidebar").addEventListener("click", toggleSidebar);
function toggleSidebar() {
	document.getElementById("sidebar").classList.toggle("disabled");
}

function test() {}
