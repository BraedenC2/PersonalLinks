// Remove all particle-related code and start with cursor trail
const cursor = document.querySelector('.cursor-trail');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
});

// Enhanced card interactions
document.querySelectorAll('.link-card').forEach(card => {
    const popSound = document.getElementById('popSound');
    
    card.addEventListener('click', (e) => {
        // Just play sound on click
        popSound.currentTime = 0;
        popSound.play();
    });

    card.addEventListener('mouseover', () => {
        card.style.background = `rgba(255, 255, 255, 0.95)`;
    });
    
    card.addEventListener('mouseout', () => {
        card.style.background = `rgba(255, 255, 255, 0.9)`;
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

        const glowStrength = 20;
        card.style.boxShadow = `
            0 8px 25px rgba(0,0,0,0.2),
            ${(x - rect.width/2) / glowStrength}px 
            ${(y - rect.height/2) / glowStrength}px 
            15px rgba(255,255,255,0.3)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
    });
});

// Rainbow cursor trail
let trails = [];
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    trail.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(trail);
    
    trails.push(trail);
    if (trails.length > 10) {  // reduced from 20
        trails[0].remove();
        trails.shift();
    }
    
    setTimeout(() => {
        trail.remove();
        trails = trails.filter(t => t !== trail);
    }, 1000);
});

class WalkingCard {
    constructor(element) {
        this.element = element;
        this.padding = 50; // Add padding from screen edges
        this.width = 200;  // Match new card width
        this.height = 200; // Approximate card height
        this.x = this.padding + Math.random() * (window.innerWidth - this.width - this.padding * 2);
        this.y = this.padding + Math.random() * (window.innerHeight - this.height - this.padding * 2);
        this.targetX = this.x;
        this.targetY = this.y;
        this.speed = 2;
        this.thinkTimer = 0;
        this.thoughts = [
            "I love being clicked! 🎈",
            "Where should I go? 🤔",
            "Hey friend! 👋",
            "What's over there? 👀",
            "I'm walking! 🚶‍♂️",
            "Time for an adventure! 🗺️"
        ];
        
        this.element.style.position = 'absolute';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        // Add thought bubble
        this.thoughtBubble = document.createElement('div');
        this.thoughtBubble.className = 'thought-bubble';
        this.element.appendChild(this.thoughtBubble);
    }

    think() {
        const thought = this.thoughts[Math.floor(Math.random() * this.thoughts.length)];
        this.thoughtBubble.textContent = thought;
        this.thoughtBubble.style.opacity = '1';
        setTimeout(() => {
            this.thoughtBubble.style.opacity = '0';
        }, 2000);
    }

    update() {
        this.thinkTimer--;
        if (this.thinkTimer <= 0) {
            // Keep cards within bounds
            this.targetX = this.padding + Math.random() * (window.innerWidth - this.width - this.padding * 2);
            this.targetY = this.padding + Math.random() * (window.innerHeight - this.height - this.padding * 2);
            this.thinkTimer = 200;
            this.think();
        }

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
            
            // Update direction
            this.element.dataset.direction = dx > 0 ? 'right' : 'left';
        }

        // Ensure cards stay within bounds
        this.x = Math.max(this.padding, Math.min(window.innerWidth - this.width - this.padding, this.x));
        this.y = Math.max(this.padding, Math.min(window.innerHeight - this.height - this.padding, this.y));
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

// Initialize walking cards
const walkingCards = Array.from(
    document.querySelectorAll('.link-card'),
    card => new WalkingCard(card)
);

function updateCards() {
    walkingCards.forEach(card => {
        card.update();
        
        // Simpler card interactions without particles
        walkingCards.forEach(otherCard => {
            if (card !== otherCard) {
                const dx = card.x - otherCard.x;
                const dy = card.y - otherCard.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    card.think();
                    card.targetX = card.x + (Math.random() * 200 - 100);
                    card.targetY = card.y + (Math.random() * 200 - 100);
                }
            }
        });
    });
    requestAnimationFrame(updateCards);
}

updateCards();

// Update card interactions
document.addEventListener('mousemove', (e) => {
    walkingCards.forEach(card => {
        const dx = card.x - e.pageX;
        const dy = card.y - e.pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            card.targetX = card.x + (dx / distance) * 200;
            card.targetY = card.y + (dy / distance) * 200;
            card.speed = 5;
            card.think();
            setTimeout(() => card.speed = 2, 1000);
        }
    });
});

// Add sound effects
const sounds = {
    hover: new Audio('https://www.soundjay.com/buttons/sounds/button-hover-1.mp3'),
    click: new Audio('https://www.soundjay.com/buttons/sounds/button-click-1.mp3')
};

document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mouseenter', () => sounds.hover.play());
    card.addEventListener('click', () => sounds.click.play());
});
