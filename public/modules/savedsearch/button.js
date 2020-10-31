export class SavedSearchButton extends HTMLElement {
    constructor() {
        super();

        this.searches = [];
        this.triggered = false;
        this.toggleTrigger = this.toggleTrigger.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" type="text/css" href="/node_modules/bootstrap/dist/css/bootstrap.min.css" />
            <button type="button" class="trigger btn btn-primary">Save this Search</button>
            <form class="form-inline d-none">
                <input type="text" name="name" placeholder="Saved Search Name" class="form-control" required />
                <button type="button" class="cancel btn btn-secondary ml-1">Cancel</button>
                <button type="submit" class="save btn btn-primary ml-1">Save</button>
            </form>
        `;

        this.searchWasSaved = new CustomEvent('savedsearch-new', {
            bubbles: true,
            cancelable: false,
        });
    }

    connectedCallback() {
        this.trigger = this.shadowRoot.querySelector('button.trigger');
        this.cancel = this.shadowRoot.querySelector('button.cancel');
        this.save = this.shadowRoot.querySelector('button.save');
        this.form = this.shadowRoot.querySelector('form');
        this.searchName = this.shadowRoot.querySelector('input[name="name"]');

        this.trigger.addEventListener('click', this.toggleTrigger);
        this.cancel.addEventListener('click', this.toggleTrigger);
        this.form.addEventListener('submit', this.saveSearch.bind(this));
    }

    toggleTrigger() {
        this.triggered = !this.triggered;
        if (this.triggered) {
            this.trigger.classList.add('d-none');
            this.form.classList.remove('d-none');
        } else {
            this.trigger.classList.remove('d-none');
            this.form.classList.add('d-none');
        }
    }

    saveSearch(e) {
        const name = this.searchName.value;
        const value = document.location.href;

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
        this.searches.push({name, value});
        localStorage.setItem('savedSearches', JSON.stringify(this.searches));
        
        this.dispatchEvent(this.searchWasSaved);
        this.toggleTrigger();
        e.preventDefault();
    }

    disconnectedCallback() {
        this.trigger.removeEventListener('click', this.toggleTrigger);
        this.cancel.removeEventListener('click', this.toggleTrigger);
    }
}

customElements.define('savedsearch-button', SavedSearchButton);