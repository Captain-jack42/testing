document.addEventListener('DOMContentLoaded', function() {
    const hotelSearchForm = document.getElementById('hotelSearchForm');
    const priceRange = document.getElementById('priceRange');
    const starFilters = document.querySelectorAll('.star-filters input');
    const amenityFilters = document.querySelectorAll('.amenity-filters input');
    const sortBy = document.getElementById('sortBy');
    const hotelCards = document.querySelectorAll('.hotel-card');

    function filterHotels() {
        const selectedStars = Array.from(starFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.value));

        const selectedAmenities = Array.from(amenityFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const maxPrice = parseInt(priceRange.value);
        const location = document.getElementById('location').value.toLowerCase();

        hotelCards.forEach(card => {
            const price = parseInt(card.dataset.price);
            const rating = parseInt(card.dataset.rating);
            const amenities = card.dataset.amenities.split(',');
            const hotelLocation = card.querySelector('.location').textContent.toLowerCase();

            const matchesPrice = price <= maxPrice;
            const matchesStars = selectedStars.length === 0 || selectedStars.includes(rating);
            const matchesAmenities = selectedAmenities.length === 0 || 
                selectedAmenities.every(amenity => amenities.includes(amenity));
            const matchesLocation = location === '' || hotelLocation.includes(location);

            card.style.display = 
                matchesPrice && matchesStars && matchesAmenities && matchesLocation
                ? 'block' : 'none';
        });
    }

    function sortHotels() {
        const sortValue = sortBy.value;
        const hotelGrid = document.querySelector('.hotel-grid');
        const hotels = Array.from(hotelCards);

        hotels.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const ratingA = parseInt(a.dataset.rating);
            const ratingB = parseInt(b.dataset.rating);

            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                default:
                    return 0;
            }
        });

        hotels.forEach(hotel => hotelGrid.appendChild(hotel));
    }

    hotelSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterHotels();
    });

    priceRange.addEventListener('input', filterHotels);
    starFilters.forEach(filter => filter.addEventListener('change', filterHotels));
    amenityFilters.forEach(filter => filter.addEventListener('change', filterHotels));
    sortBy.addEventListener('change', sortHotels);

    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkInInput.addEventListener('change', function() {
        checkOutInput.min = this.value;
    });
}); 