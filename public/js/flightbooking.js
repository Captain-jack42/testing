document.addEventListener('DOMContentLoaded', function() {
    const flightSearchForm = document.getElementById('flightSearchForm');
    const priceRange = document.getElementById('priceRange');
    const timeFilters = document.querySelectorAll('.time-filters input');
    const stopFilters = document.querySelectorAll('.stop-filters input');
    const sortBy = document.getElementById('sortBy');
    const flightCards = document.querySelectorAll('.flight-card');
    const returnDateGroup = document.querySelector('.return-date-group');

    // Handle trip type selection
    document.querySelectorAll('input[name="tripType"]').forEach(input => {
        input.addEventListener('change', function() {
            returnDateGroup.style.display = this.value === 'roundtrip' ? 'block' : 'none';
        });
    });

    // Update price range display
    const priceDisplay = document.querySelector('.price-range-labels span:nth-child(2)');
    priceRange.addEventListener('input', function() {
        priceDisplay.textContent = `₹${this.value}`;
    });

    function getTimeSlot(departure) {
        const hour = parseInt(departure.substring(0, 2));
        if (hour >= 0 && hour < 6) return 'early';
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        return 'evening';
    }

    function filterFlights() {
        const fromCity = document.getElementById('from').value.toLowerCase();
        const toCity = document.getElementById('to').value.toLowerCase();
        const selectedAirline = document.getElementById('airline').value;
        const maxPrice = parseInt(priceRange.value);
        
        const selectedTimes = Array.from(timeFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            
        const selectedStops = Array.from(stopFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        let visibleCount = 0;

        flightCards.forEach(card => {
            const cardFrom = card.dataset.from;
            const cardTo = card.dataset.to;
            const price = parseInt(card.dataset.price);
            const airline = card.dataset.airline;
            const timeSlot = getTimeSlot(card.dataset.departure);
            const stops = card.dataset.stops;

            const matchesRoute = (!fromCity || cardFrom.includes(fromCity)) && 
                               (!toCity || cardTo.includes(toCity));
            const matchesPrice = price <= maxPrice;
            const matchesAirline = !selectedAirline || airline === selectedAirline;
            const matchesTime = selectedTimes.length === 0 || selectedTimes.includes(timeSlot);
            const matchesStops = selectedStops.length === 0 || selectedStops.includes(stops);

            const isVisible = matchesRoute && matchesPrice && matchesAirline && 
                            matchesTime && matchesStops;

            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        updateNoResultsMessage(visibleCount);
    }

    function updateNoResultsMessage(visibleCount) {
        let noResults = document.querySelector('.no-results-message');
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results-message';
                noResults.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-plane-slash"></i>
                        <h3>No Flights Found</h3>
                        <p>Try adjusting your search criteria:</p>
                        <ul>
                            <li>Change your travel dates</li>
                            <li>Modify your filters</li>
                            <li>Check different routes</li>
                        </ul>
                    </div>
                `;
                document.querySelector('.flight-grid').appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    function sortFlights() {
        const sortValue = sortBy.value;
        const flightGrid = document.querySelector('.flight-grid');
        const flights = Array.from(flightCards);

        flights.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const durationA = parseInt(a.dataset.duration);
            const durationB = parseInt(b.dataset.duration);
            const departureA = parseInt(a.dataset.departure);
            const departureB = parseInt(b.dataset.departure);

            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'duration':
                    return durationA - durationB;
                case 'departure':
                    return departureA - departureB;
            }
        });

        // Reappend sorted flights while maintaining visibility
        flights.forEach(flight => {
            flightGrid.appendChild(flight);
        });
    }

    // Event Listeners
    flightSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterFlights();
    });

    // Real-time filtering
    priceRange.addEventListener('input', filterFlights);
    timeFilters.forEach(filter => filter.addEventListener('change', filterFlights));
    stopFilters.forEach(filter => filter.addEventListener('change', filterFlights));
    document.getElementById('airline').addEventListener('change', filterFlights);
    sortBy.addEventListener('change', sortFlights);

    // Initialize date inputs
    const today = new Date().toISOString().split('T')[0];
    const departureDate = document.getElementById('departureDate');
    const returnDate = document.getElementById('returnDate');
    
    departureDate.min = today;
    departureDate.addEventListener('change', function() {
        returnDate.min = this.value;
        if (returnDate.value && returnDate.value < this.value) {
            returnDate.value = this.value;
        }
    });
}); 