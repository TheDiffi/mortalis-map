import markerJson from "../../../assets/geo/markers.json";

const MARKER_ICON_URL = "https://img.icons8.com/material-rounded/24/null/location-marker.png";

export const MARKER_LAYERS = [
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

/**
 * @typedef {Object} Layer
 * @property {string} type - The type of the layer
 * @property {string} style - The style of the layer
 * @property {string} symbol - The symbol of the layer
 * @property {string} layerName - The name of the layer
 */

class LayerButton {
	button;

	/**
	 * @param {Layer} layer - The layer object
	 * @param {Map.setLayerVisibility} setLayerVisibility - The function to set the layer visibility
	 */
	constructor(layer, setLayerVisibility) {
		this.button = document.createElement("button");
		this.button.innerText = layer.type;
		this.button.value = layer.layerName;
		this.button.classList.add("map-element-marker-button");
		this.button.addEventListener("click", () => {
			this.button.classList.toggle("active");
			setLayerVisibility(layer.layerName, this.isActive());
		});
	}

	getElement = () => {
		return this.button;
	};

	isActive = () => {
		return this.button.classList.contains("active");
	};
}

class MarkerManager {
	constructor(mapManager) {
		this.mapManager = mapManager;
	}

	generateMarkerLayerButtons = () => {
		const markerInputs = document.getElementById("marker-input-container");

		MARKER_LAYERS.forEach((layer) => {
			const button = new LayerButton(layer, this.mapManager.setLayerVisibility);
			markerInputs.appendChild(button.getElement());
		});
	};

	updateMarkerLayersVisibility = () => {
		console.log("Loading checked layers");
		const inputGroup = document.getElementById("marker-input-container");
		inputGroup.childNodes.forEach((btn) => {
			try {
				this.mapManager.setLayerVisibility(btn.value, this.isButtonActive(btn));
			} catch (error) {
				console.log("LayerVisibilityError: " + error);
			}
		});
	};

	isButtonActive = () => {
		return this.button.classList.contains("active");
	};

	loadAllMarkers = (map) => {
		console.log("Loading all markers");
		this.loadMarkerSymbols(map);
		MARKER_LAYERS.forEach((layer) => {
			console.log("Loading marker layer: " + layer.type);
			this.loadMarkerLayer(map, layer);
		});
	};

	loadMarkerLayer = (map, layer) => {
		// loads just the markers from the features -> markers
		const actualMarkers = this.filterMarkersByType(markerJson, layer.type);
		map.addSource(layer.layerName, {
			type: "geojson",
			data: actualMarkers,
		});
		console.log("MarkerJSon: " + layer.type);
		console.log(actualMarkers);
		this.addLayerToMap(layer, map);
	};

	addLayerToMap = (layer, map) => {
		const layerOptions = {
			id: layer.layerName,
			type: layer.style,
			source: layer.layerName,
			layout: {},
		};

		if (layer.style === "symbol") {
			layerOptions.layout["icon-image"] = layer.symbol;
		}

		map.addLayer(layerOptions);
	};

	loadMarkerSymbols = (map) => {
		try {
			map.loadImage(MARKER_ICON_URL, (error, image) => {
				if (error) throw error;
				map.addImage("marker-sb-1", image);
			});
		} catch (error) {
			console.log("MarkerSymbolsError: " + error);
		}
	};

	filterMarkersByType = (geojson, type) => {
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
	};
}

export default MarkerManager;
