export class SavedSearchSelector extends HTMLElement {
    constructor() {
        super();
        this.searches = [];

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" type="text/css" href="public/modules/savedsearch/selector.css" />
            <div>
                <span class="summary">
                    Saved Searches
                    <output></output>
                </span>
                <menu class="closed">
                </menu>
            </div>
        `;
    }

    connectedCallback() {
        this.toggle = this.shadowRoot.querySelector('.summary');
        this.output = this.shadowRoot.querySelector('output');
        this.menu = this.shadowRoot.querySelector('menu');
        this.toggle.addEventListener('click', this.toggleMenu.bind(this));
        window.addEventListener('savedsearch-new', this.updateMenuLinks.bind(this));
        this.menu.addEventListener('click', this.handleMenuLink.bind(this));
        this.updateMenuLinks();
    }
    
    disconnectedCallback() {
        this.toggle.removeEventListener('click', this.toggleMenu);
        window.removeEventListener('savedsearch-new', this.updateMenuLinks);
        this.menu.removeEventListener('click', this.handleMenuLink);
    }

    toggleMenu() {
        if (this.menu.classList.contains('closed')) {
            this.menu.classList.remove('closed');
        } else {
            this.menu.classList.add('closed');
        }
    }

    updateMenuLinks() {
        const jsonSearches = localStorage.getItem('savedSearches');
        let retrievedSearches;
        try {
            retrievedSearches = JSON.parse(jsonSearches);
        } catch(error) {
            retrievedSearches = [];
        }
        if (retrievedSearches && typeof retrievedSearches === 'object' && retrievedSearches.length) {
            this.searches = retrievedSearches;
        }

        this.output.value = this.searches.length;
        this.menu.innerHTML = (this.searches.length === 0)
            ? `<ul><li>You currently have no saved searches available</li></ul>`
            : '<ul>' + this.searches.map((item, idx) => {
                const name = item.name && item.name.length ? item.name : `Link ${idx + 1}`;
                const value = item.value;
                return `<li><a href="${value}">${name}</a></li>`;
            }).join('') + '</ul>';
    }

    handleMenuLink(e) {
        if (e.target.tagName === 'a') {
            document.location.href = e.target.getAttribute('href');
        }
    }

}

customElements.define('savedsearch-selector', SavedSearchSelector);