import Base from "mapbox-gl-controls/lib/Base/Base";
import Button from "mapbox-gl-controls/lib/Button/Button";

export default class StylesSwitcher extends Base {
	styles;
	onChange;
	buttons;
	first;

	constructor(options) {
		super();
		this.styles = options?.styles ?? this.defaultOptions;
		this.onChange = options?.onChange;
		this.buttons = [];
		this.first = true;
	}

	insert() {
		this.addClassName("mapbox-control-styles");
		this.styles.forEach((style) => {
			this.createButton(style);
		});
	}

	createButton(style) {
		const button = new Button();
		button.setText(style.label);
		button.addClassName("mapbox-control-styles-button");
		if (this.first) {
			button.addClassName("active");
			this.first = false;
		}
       
		button.onClick(() => {
			if (isActive(button)) return;
			this.map.setStyle(style.styleUrl);
			this.buttons.forEach((button) => {
				setActive(false, button);
			});
			setActive(true, button);
			if (this.onChange) this.onChange(style);
		});
		this.buttons.push(button);
		this.addButton(button);
	}

	onAddControl() {
		this.insert();
	}
}

function setActive(active, button) {
	if (active) {
		button.node.classList.add("active");
	} else {
		button.removeClassName("active");
	}
}

function isActive(button) {
	return button.node.classList.contains("active");
}
