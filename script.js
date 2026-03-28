document.addEventListener('DOMContentLoaded', () => {
    // Staggered card entrance animation
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease, border-color 0.3s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 120 + i * 80);
    });
});
