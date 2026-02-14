class PatientDBClient {
    constructor() {
        this.insertBtn = null;
        this.queryBtn = null;
        this.queryTextArea = null;
        this.insertResponse = null;
        this.insertResponseText = null;
        this.queryResponse = null;
        this.queryResponseText = null;
        this.server2URL = 'https://four537lab4-vg9m.onrender.com';
    }

    // initialize the client and set up event listeners
    init() {
        this.insertBtn = document.getElementById('insertBtn');
        this.queryBtn = document.getElementById('queryBtn');
        this.queryTextArea = document.getElementById('queryText');
        this.insertResponse = document.getElementById('insertResponse');
        this.insertResponseText = document.getElementById('insertResponseText');
        this.queryResponse = document.getElementById('queryResponse');
        this.queryResponseText = document.getElementById('queryResponseText');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.insertBtn.addEventListener('click', (e) => this.handleInsert(e));
        this.queryBtn.addEventListener('click', (e) => this.handleQuery(e));
    }

    // handle insert button click
    async handleInsert(event) {
        try {
            // Show loading state
            this.insertResponseText.innerHTML = 'Inserting patients...';
            this.insertResponse.style.display = 'block';
            this.insertResponse.className = 'response';

            const response = await this.sendInsertRequest();
            const data = await response.text();
            this.displayInsertResponse(data);
        } catch (error) {
            this.displayInsertError(error.message);
        }
    }

    // handle query button click
    async handleQuery(event) {
        const query = this.queryTextArea.value.trim();

        if (!query) {
            alert('Please enter a SQL query');
            return;
        }

        try {
            this.queryResponseText.textContent = 'Executing query...';
            this.queryResponse.style.display = 'block';
            this.queryResponse.className = 'response';

            const response = await this.sendQueryRequest(query);
            const data = await response.json();
            this.displayQueryResponse(data);
        } catch (error) {
            this.displayQueryError(error.message);
        }
    }

    // send POST request to insert patients
    async sendInsertRequest() {
        const url = `${this.server2URL}/api/v1/insert`;
        return await fetch(url, {
            method: 'POST'
        });
    }

    // send GET request with SQL query
    async sendQueryRequest(query) {
        const url = `${this.server2URL}/api/v1/sql?queryStatement=${encodeURIComponent(query)}`;
        return await fetch(url);
    }

    displayInsertResponse(data) {
        this.insertResponseText.innerHTML = `<strong>Success:</strong> ${data}`;
        this.insertResponse.className = 'response success';
    }

    displayInsertError(errorMessage) {
        this.insertResponseText.innerHTML = `<strong>Error:</strong> ${errorMessage}`;
        this.insertResponse.className = 'response error';
    }

    displayQueryResponse(data) {
        this.queryResponseText.textContent = JSON.stringify(data, null, 2);
        this.queryResponse.className = 'response success';
    }

    displayQueryError(errorMessage) {
        this.queryResponseText.textContent = `Error: ${errorMessage}`;
        this.queryResponse.className = 'response error';
    }
}

// creating instance and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const client = new PatientDBClient();
    client.init();
});