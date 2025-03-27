// Predefined packages data
const packages = [
    {
        id: 1,
        title: "Kerala Backwaters Bliss",
        destination: "Kerala",
        duration: "4-7",
        type: "family",
        price: 35000,
        rating: 4.5,
        travelers: "4",
        features: ["hotel", "meals", "transport", "activities"],
        style: "guided",
        image: "/css/images/packages/kerala.jpg",
        description: "Experience the serene backwaters of Kerala with family-friendly activities.",
        highlights: ["Houseboat Stay", "Ayurvedic Spa", "Cultural Shows", "Beach Activities"]
    },
    {
        id: 2,
        title: "Romantic Rajasthan",
        destination: "Rajasthan",
        duration: "8-14",
        type: "honeymoon",
        price: 75000,
        rating: 4.8,
        travelers: "2",
        features: ["hotel", "flight", "meals", "transport", "guide"],
        style: "private",
        image: "/css/images/packages/rajasthan.jpg",
        description: "Luxury honeymoon tour through royal Rajasthan.",
        highlights: ["Palace Stays", "Desert Safari", "Candlelight Dinners", "Private Tours"]
    },
    {
        id: 3,
        title: "Himalayan Adventure Trek",
        destination: "Himachal Pradesh",
        duration: "4-7",
        type: "adventure",
        price: 45000,
        rating: 4.6,
        travelers: "1",
        features: ["hotel", "meals", "transport", "guide", "activities"],
        style: "group",
        image: "/css/images/packages/himachal.jpg",
        description: "Thrilling trek through the Himalayan trails.",
        highlights: ["Camping", "Trekking", "River Rafting", "Mountain Biking"]
    },
    {
        id: 4,
        title: "Golden Triangle Cultural Tour",
        destination: "Delhi-Agra-Jaipur",
        duration: "4-7",
        type: "cultural",
        price: 55000,
        rating: 4.7,
        travelers: "3",
        features: ["hotel", "flight", "meals", "transport", "guide"],
        style: "guided",
        image: "/css/images/packages/golden-triangle.jpg",
        description: "Explore India's rich heritage through the Golden Triangle.",
        highlights: ["Taj Mahal", "Amber Fort", "Red Fort", "Local Markets"]
    },
    {
        id: 5,
        title: "Goa Beach Vacation",
        destination: "Goa",
        duration: "1-3",
        type: "budget",
        price: 25000,
        rating: 4.3,
        travelers: "2",
        features: ["hotel", "transport", "activities"],
        style: "independent",
        image: "/css/images/packages/goa.jpg",
        description: "Perfect beach holiday with water sports and nightlife.",
        highlights: ["Beach Activities", "Water Sports", "Nightlife", "Local Cuisine"]
    }
];

// Function to create package card HTML
function createPackageCard(package) {
    return `
        <div class="package-card" data-package='${JSON.stringify(package)}'>
            <img src="${package.image}" alt="${package.title}">
            <span class="package-type-badge">${package.type}</span>
            <div class="package-content">
                <h3 class="package-title">${package.title}</h3>
                <div class="package-rating">
                    <span class="stars">${'★'.repeat(Math.floor(package.rating))}${package.rating % 1 ? '½' : ''}</span>
                    <span class="rating-text">${package.rating}/5</span>
                </div>
                <p class="package-description">${package.description}</p>
                <ul class="package-highlights">
                    ${package.highlights.map(highlight => `
                        <li><i class="fas fa-check-circle"></i> ${highlight}</li>
                    `).join('')}
                </ul>
                <div class="package-features">
                    ${package.features.map(feature => `
                        <span class="feature-tag">
                            <i class="fas fa-${getFeatureIcon(feature)}"></i>
                            ${feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </span>
                    `).join('')}
                </div>
                <div class="package-footer">
                    <div class="price">
                        <span class="amount">₹${package.price.toLocaleString()}</span>
                        <span class="per-person">per person</span>
                    </div>
                    <button class="book-btn">
                        <i class="fas fa-bookmark"></i>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper function to get feature icons
function getFeatureIcon(feature) {
    const icons = {
        hotel: 'hotel',
        flight: 'plane',
        meals: 'utensils',
        transport: 'bus',
        guide: 'user-tie',
        activities: 'hiking'
    };
    return icons[feature] || 'check';
}

// Function to filter packages
function filterPackages() {
    const destination = document.getElementById('destination').value.toLowerCase();
    const duration = document.getElementById('duration').value;
    const travelers = document.getElementById('travelers').value;
    const packageType = document.getElementById('packageType').value;
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const selectedFeatures = Array.from(document.querySelectorAll('.feature-filters input:checked')).map(input => input.value);
    const selectedStyles = Array.from(document.querySelectorAll('.style-filters input:checked')).map(input => input.value);

    const filteredPackages = packages.filter(package => {
        const matchesDestination = !destination || package.destination.toLowerCase().includes(destination);
        const matchesDuration = duration === 'all' || package.duration === duration;
        const matchesTravelers = travelers === 'all' || package.travelers === travelers;
        const matchesType = packageType === 'all' || package.type === packageType;
        const matchesPrice = package.price <= priceRange;
        const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every(feature => package.features.includes(feature));
        const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(package.style);

        return matchesDestination && matchesDuration && matchesTravelers && 
               matchesType && matchesPrice && matchesFeatures && matchesStyle;
    });

    displayPackages(filteredPackages);
}

// Function to display packages
function displayPackages(packagesToShow) {
    const packageGrid = document.querySelector('.package-grid');
    if (packagesToShow.length === 0) {
        packageGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No packages found matching your criteria. Try adjusting your filters.</p>
            </div>
        `;
    } else {
        packageGrid.innerHTML = packagesToShow.map(package => createPackageCard(package)).join('');
    }
}

// Function to sort packages
function sortPackages() {
    const sortBy = document.getElementById('sortBy').value;
    const packageGrid = document.querySelector('.package-grid');
    const packages = Array.from(packageGrid.children);

    packages.sort((a, b) => {
        const packageA = JSON.parse(a.dataset.package);
        const packageB = JSON.parse(b.dataset.package);

        switch(sortBy) {
            case 'price-low':
                return packageA.price - packageB.price;
            case 'price-high':
                return packageB.price - packageA.price;
            case 'duration':
                return packageB.duration.localeCompare(packageA.duration);
            case 'rating':
                return packageB.rating - packageA.rating;
            default:
                return 0;
        }
    });

    packageGrid.innerHTML = '';
    packages.forEach(package => packageGrid.appendChild(package));
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Display all packages initially
    displayPackages(packages);

    // Add event listeners for filters
    document.getElementById('packageSearchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        filterPackages();
    });

    document.getElementById('priceRange').addEventListener('input', filterPackages);
    document.querySelectorAll('.feature-filters input, .style-filters input').forEach(input => {
        input.addEventListener('change', filterPackages);
    });
    document.getElementById('sortBy').addEventListener('change', sortPackages);

    // Initialize date input with today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travelDate').min = today;
    document.getElementById('travelDate').value = today;
}); 