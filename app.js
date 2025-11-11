// Canvas Background Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
}

// Initial resize
resizeCanvas();

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});

// Particle system
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${Math.random() * 0.5 + 0.1})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Connect particles that are close to each other
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `hsla(200, 70%, 60%, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

// Start animation
animate();

// Interactive cursor effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Create a ripple effect when moving mouse
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x - 10}px`;
    ripple.style.top = `${y - 10}px`;
    document.body.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 1000);
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 1s ease-out;
        z-index: 9999;
    }
    
    @keyframes ripple {
        to {
            transform: scale(10);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Card hover effects
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        
        // Apply 3D tilt effect
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        
        // Glow effect
        const glow = document.createElement('div');
        glow.className = 'glow';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        card.appendChild(glow);
        
        // Remove glow after animation
        setTimeout(() => {
            glow.remove();
        }, 1000);
    });
    
    // Reset card position when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Add glow effect styles
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    .glow {
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: glow 1s ease-out;
    }
    
    @keyframes glow {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.5;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(glowStyle);

// Typewriter effect for tagline
const tagline = document.querySelector('.tagline');
const text = tagline.textContent;
tagline.textContent = '';

let i = 0;
function typeWriter() {
    if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

// Start typewriter effect after a short delay
setTimeout(typeWriter, 1000);

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    card.classList.add('fade-in');
    observer.observe(card);
});

// Add CSS for scroll animations
const scrollAnimationStyle = document.createElement('style');
scrollAnimationStyle.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(scrollAnimationStyle);

// Add audio visualization to DJ card
const djCard = document.getElementById('dj');
const waveform = djCard.querySelector('.waveform');

// Create audio context for visualization
let audioContext;
let analyser;
let dataArray;

// Only initialize audio on user interaction
document.addEventListener('click', function initAudio() {
    if (audioContext) return;
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    // Create a dummy oscillator for demo purposes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Start oscillator
    oscillator.start();
    
    // Set up visualization
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    // Visualize when hovering over DJ card
    djCard.addEventListener('mouseenter', () => {
        if (!audioContext) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 100;
        canvas.style.width = '100%';
        canvas.style.height = '100px';
        
        waveform.innerHTML = '';
        waveform.appendChild(canvas);
        
        function draw() {
            if (!djCard.matches(':hover')) return;
            
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let x = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                const hue = 200 + (i / dataArray.length) * 60;
                
                ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.7)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 2;
            }
        }
        
        draw();
    });
    
    // Remove event listener after initialization
    document.removeEventListener('click', initAudio);
}, { once: true });
