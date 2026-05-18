class MovieRecommenderApp {
    constructor() {
        this.apiBase = 'https://movie-recommendation-system-amta.onrender.com';
        this.currentMode = 'light';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRandomMovies();
    }

    bindEvents() {
        document.getElementById('modeToggle').addEventListener('click', () => this.toggleMode());
        
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.mood, 'mood'));
        });

        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.genre, 'genre'));
        });

        document.getElementById('randomBtn').addEventListener('click', () => this.loadRandomMovies());
    }

    async handleSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        this.showLoading(`Searching for "${query}"...`);
        try {
            const response = await fetch(`${this.apiBase}/search/${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success) {
                this.displayMovies(data.movies, `Search Results for "${query}"`);
            } else {
                this.showError(`No results found for "${query}"`);
            }
        } catch (error) {
            this.showError('Search failed. Please try again.');
        }
    }

    async handleQuickAction(value, type) {
        let endpoint, title;

        if (type === 'mood') {
            endpoint = `/mood/${value}`;
            title = `Movies for ${value.charAt(0).toUpperCase() + value.slice(1)} Mood`;
        } else {
            endpoint = `/genre/${value}`;
            title = `${value} Movies`;
        }

        this.showLoading(`Loading ${value} recommendations...`);

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`);
            const data = await response.json();

            if (data.success) {
                this.displayMovies(data.movies, title);
            }
        } catch (error) {
            this.showError('Failed to load recommendations.');
        }
    }

    async loadRandomMovies() {
        this.showLoading('Getting surprise recommendations...');
        try {
            const response = await fetch(`${this.apiBase}/random`);
            const data = await response.json();

            if (data.success) {
                this.displayMovies(data.movies, 'Recommended For You');
            }
        } catch (error) {
            this.showError('Failed to load recommendations.');
        }
    }

    // ↓ Make sure you have displayMovies(), showLoading(), showError() in same file
}
