document.addEventListener('DOMContentLoaded', function() {
    const carSearchForm = document.getElementById('carSearchForm');
    const priceRange = document.getElementById('priceRange');
    const featureFilters = document.querySelectorAll('.feature-filters input');
    const brandFilters = document.querySelectorAll('.brand-filters input');
    const sortBy = document.getElementById('sortBy');
    const carCards = document.querySelectorAll('.car-card');

    // The main issue is with the carType, transmission, and fuelType selects
    // They need "all" options added to their select elements
    function addAllOption(selectElement) {
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All ' + selectElement.id.charAt(0).toUpperCase() + selectElement.id.slice(1) + 's';
        selectElement.insertBefore(allOption, selectElement.firstChild);
        selectElement.value = 'all';
    }

    // Add "All" options to select elements
    addAllOption(document.getElementById('carType'));
    addAllOption(document.getElementById('transmission'));
    addAllOption(document.getElementById('fuelType'));

    function filterCars() {
        const pickupLocation = document.getElementById('pickupLocation').value.toLowerCase();
        const selectedCarType = document.getElementById('carType').value;
        const selectedTransmission = document.getElementById('transmission').value;
        const selectedFuelType = document.getElementById('fuelType').value;
        const maxPrice = parseInt(priceRange.value);

        const selectedFeatures = Array.from(featureFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedBrands = Array.from(brandFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        carCards.forEach(card => {
            // Get all data attributes
            const cardData = card.dataset;
            
            // Check each filter condition
            const matchesLocation = !pickupLocation || 
                cardData.location.toLowerCase().includes(pickupLocation);
            
            const matchesPrice = parseInt(cardData.price) <= maxPrice;
            
            const matchesType = selectedCarType === 'all' || 
                cardData.type === selectedCarType;
            
            const matchesTransmission = selectedTransmission === 'all' || 
                cardData.transmission === selectedTransmission;
            
            const matchesFuel = selectedFuelType === 'all' || 
                cardData.fuel === selectedFuelType;
            
            const cardFeatures = cardData.features.split(',');
            const matchesFeatures = selectedFeatures.length === 0 || 
                selectedFeatures.every(feature => cardFeatures.includes(feature));
            
            const matchesBrand = selectedBrands.length === 0 || 
                selectedBrands.includes(cardData.brand);

            // Show/hide card based on all conditions
            const isVisible = matchesLocation && matchesPrice && matchesType && 
                            matchesTransmission && matchesFuel && 
                            matchesFeatures && matchesBrand;

            card.style.display = isVisible ? 'block' : 'none';
        });

        // Check if any cars are visible
        const visibleCars = Array.from(carCards).some(card => card.style.display === 'block');
        showNoResultsMessage(!visibleCars);
    }

    function showNoResultsMessage(show) {
        let messageElement = document.querySelector('.no-results-message');
        
        if (show) {
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'no-results-message';
                messageElement.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-car-slash"></i>
                        <h3>No Cars Available</h3>
                        <p>Try adjusting your search criteria:</p>
                        <ul>
                            <li>Change your location</li>
                            <li>Adjust price range</li>
                            <li>Modify car type or features</li>
                            <li>Check different dates</li>
                        </ul>
                    </div>
                `;
                document.querySelector('.car-grid').appendChild(messageElement);
            }
        } else if (messageElement) {
            messageElement.remove();
        }
    }

    function sortCars() {
        const sortValue = sortBy.value;
        const carGrid = document.querySelector('.car-grid');
        const cars = Array.from(carCards);

        cars.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const ratingA = parseFloat(a.querySelector('.rating-text').textContent);
            const ratingB = parseFloat(b.querySelector('.rating-text').textContent);

            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                case 'popular':
                    // Sort by rating and then by price if ratings are equal
                    return ratingB - ratingA || priceA - priceB;
                default:
                    return 0;
            }
        });

        // Reappend sorted cards while maintaining their visibility
        cars.forEach(car => {
            carGrid.appendChild(car);
        });
    }

    // Event Listeners
    carSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterCars();
    });

    // Real-time filtering for all inputs
    priceRange.addEventListener('input', filterCars);
    featureFilters.forEach(filter => filter.addEventListener('change', filterCars));
    brandFilters.forEach(filter => filter.addEventListener('change', filterCars));
    document.getElementById('carType').addEventListener('change', filterCars);
    document.getElementById('transmission').addEventListener('change', filterCars);
    document.getElementById('fuelType').addEventListener('change', filterCars);
    document.getElementById('pickupLocation').addEventListener('input', filterCars);
    sortBy.addEventListener('change', sortCars);

    // Date validation
    const today = new Date().toISOString().split('T')[0];
    const pickupDate = document.getElementById('pickupDate');
    const dropoffDate = document.getElementById('dropoffDate');
    
    pickupDate.min = today;
    pickupDate.value = today;
    
    pickupDate.addEventListener('change', function() {
        dropoffDate.min = this.value;
        if (dropoffDate.value && dropoffDate.value < this.value) {
            dropoffDate.value = this.value;
        }
        filterCars();
    });

    dropoffDate.addEventListener('change', filterCars);

    // Initialize price range display
    const priceDisplay = document.querySelector('.price-range-labels span:nth-child(2)');
    priceDisplay.textContent = `₹${priceRange.value}`;
    
    // Initial filter
    filterCars();
}); 