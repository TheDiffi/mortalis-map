class Sidebar {
	constructor() {
		this.sidebarElement = document.getElementById("sidebar");
		this.contentContainer = document.getElementById("sidebar-content");
		this.toggleButton = document.getElementById("toggle-sidebar");
		this.toggleButton.addEventListener("click", () => this.toggleSidebar());
	}

	toggleSidebar() {
		this.sidebarElement.classList.toggle("disabled");
	}

	setContent(content) {
		this.contentContainer.innerHTML = content;
	}
}

export default Sidebar;
