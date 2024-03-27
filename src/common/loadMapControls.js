import { RulerControl } from "mapbox-gl-controls";
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

const switchToFeetZoomLevel = 15;

export default function loadMapControls(map, controls, changeStyle) {
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
