document.addEventListener('DOMContentLoaded', function() {
  
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('faqSearch');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
           
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                }
            });

            
            item.classList.toggle('active');
            const icon = item.querySelector('.toggle-icon i');
            icon.className = item.classList.contains('active') ? 'fas fa-minus' : 'fas fa-plus';
        });
    });

   
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
           
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            
            
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        faqItems.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        
        const visibleItems = Array.from(faqItems).some(item => item.style.display === 'block');
        const noResultsMsg = document.querySelector('.no-results');
        
        if (!visibleItems) {
            if (!noResultsMsg) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.innerHTML = `
                    <p>No matching questions found.</p>
                    <p>Try different keywords or <a href="/contact">contact our support team</a>.</p>
                `;
                document.querySelector('.faq-content').appendChild(message);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });

    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            searchInput.value = '';
            const noResultsMsg = document.querySelector('.no-results');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    });
}); 