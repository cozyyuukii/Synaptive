lucide.createIcons();

// --- LENIS SMOOTH SCROLL SETUP ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Remove Loader on Load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500); 
});

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

// Scroll Reveal
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- CAROUSEL LOGIC ---
const projects = [
    { title: "Project - klickedu", tech: "HTML • TailwindCSS • Google Apps Script", img: "assets/educart.png" },
    { title: "Project - Fayiz", tech: "HTML • JS • Tailwind CSS", img: "assets/fayiz.png" },
    { title: "Project - Juah", tech: "HTML • JS • CSS", img: "assets/juah.png" },
    { title: "Project - Omkar.fun", tech: "Tailwind CSS • HTML • JS", img: "assets/omkar.png" },
    { title: "Project - CryptoVault", tech: "Node.js • Coingekko API • React", img: "assets/vault.png" },
    { title: "Project - prnv", tech: "HTML • Tailwind CSS • JS", img: "assets/prnv.png" },
    { title: "Project - yuukii", tech: "HTML • CSS • JS", img: "assets/yuukii.png" }
];

const stage = document.getElementById('carousel-stage');
let currentIndex = 0;
let cardElements = [];
let carouselTimer;

function renderCards() {
    stage.innerHTML = '';
    projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'deployment-card';
        card.onclick = () => jumpToCard(index);
        
        card.innerHTML = `
            <div class="deployment-header">
                <div class="dot bg-red-400"></div>
                <div class="dot bg-yellow-400"></div>
                <div class="dot bg-green-400"></div>
            </div>
            <div class="deployment-body">
                <img src="${proj.img}" class="deployment-img" alt="${proj.title}" onerror="this.src='https://placehold.co/600x400?text=Project+Image'">
                <div class="deployment-overlay">
                    <h3 class="text-2xl font-bold">${proj.title}</h3>
                    <p>${proj.tech}</p>
                </div>
            </div>
        `;
        stage.appendChild(card);
    });
    cardElements = Array.from(document.querySelectorAll('.deployment-card'));
    updateCarousel();
    resetTimer(); 
}

function updateCarousel() {
    const total = cardElements.length;
    cardElements.forEach((card, i) => {
        card.className = 'deployment-card';
        if (i === currentIndex) {
            card.classList.add('active');
        } else if (i === (currentIndex + 1) % total) {
            card.classList.add('next');
        } else if (i === (currentIndex - 1 + total) % total) {
            card.classList.add('prev');
        }
    });
}

function jumpToCard(index) {
    currentIndex = index;
    updateCarousel();
    resetTimer(); 
}

function rotateCarousel() {
    currentIndex = (currentIndex + 1) % cardElements.length;
    updateCarousel();
}

function resetTimer() {
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(rotateCarousel, 3500);
}

// Touch/Swipe Logic
let touchStartX = 0;
let touchEndX = 0;

stage.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

stage.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    const swipeThreshold = 50; 
    if (touchEndX < touchStartX - swipeThreshold) {
        rotateCarousel();
        resetTimer();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        updateCarousel();
        resetTimer();
    }
}
renderCards();

// --- THREE.JS SCENE ---
function initThreeJS() {
    if (typeof THREE === 'undefined') {
        setTimeout(initThreeJS, 100);
        return;
    }

    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    while(container.firstChild) container.removeChild(container.firstChild);
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF9F9F7, 0.05);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 0, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xE0F7FA, 0.6);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const mainMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
    const blackEarMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.2, emissive: 0x222222, emissiveIntensity: 0.1 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.0, metalness: 0.9, transparent: true, opacity: 0.8, transmission: 0.1 });

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    const headGeo = new THREE.SphereGeometry(1, 32, 32);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.castShadow = true; head.receiveShadow = true;
    robotGroup.add(head);

    const visorGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const visor = new THREE.Mesh(visorGeo, glassMat);
    visor.position.set(0, 0.1, 0.55);
    visor.scale.set(1.1, 0.6, 1);
    head.add(visor);

    const earGeo = new THREE.SphereGeometry(0.35, 16, 16);
    
    const leftEar = new THREE.Mesh(earGeo, blackEarMat);
    leftEar.position.set(-0.92, 0, 0); leftEar.scale.set(0.5, 1, 1); leftEar.castShadow = true;
    head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, blackEarMat);
    rightEar.position.set(0.92, 0, 0); rightEar.scale.set(0.5, 1, 1); rightEar.castShadow = true;
    head.add(rightEar);

    const handGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const leftHand = new THREE.Mesh(handGeo, accentMat);
    leftHand.position.set(-1.4, -0.8, 0.3); leftHand.castShadow = true;
    robotGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, accentMat);
    rightHand.position.set(1.4, -0.8, 0.3); rightHand.castShadow = true;
    robotGroup.add(rightHand);

    const haloGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 50);
    const halo = new THREE.Mesh(haloGeo, accentMat);
    halo.position.set(0, 0, -0.2); halo.rotateX(Math.PI / 8); 
    robotGroup.add(halo);

    const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const particle1 = new THREE.Mesh(particleGeo, darkMat);
    particle1.position.set(1.8, 0.8, -0.5);
    robotGroup.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeo, darkMat);
    particle2.position.set(-1.7, 0.5, 0.5);
    robotGroup.add(particle2);

    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    
    const homeSection = document.getElementById('home');
    if(homeSection) heroObserver.observe(homeSection);

    let targetRotX = 0, targetRotY = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible) return;

        const time = Date.now() * 0.0015;
        robotGroup.position.y = Math.sin(time) * 0.15; 
        leftHand.position.y = -0.8 + Math.sin(time * 1.2) * 0.1;
        rightHand.position.y = -0.8 + Math.sin(time * 1.3 + 1) * 0.1;
        halo.rotation.z = time * 0.2;
        halo.rotation.x = (Math.PI / 8) + Math.sin(time * 0.5) * 0.1;
        particle1.position.y = 0.8 + Math.sin(time * 2) * 0.1;
        particle2.position.y = 0.5 + Math.cos(time * 1.5) * 0.1;

        targetRotY = mouseX * 0.6;
        targetRotX = mouseY * 0.4;
        robotGroup.rotation.y += 0.05 * (targetRotY - robotGroup.rotation.y);
        robotGroup.rotation.x += 0.05 * (targetRotX - robotGroup.rotation.x);
        head.rotation.y = mouseX * 0.3; 
        head.rotation.x = mouseY * 0.3;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
window.addEventListener('load', initThreeJS);

// --- FORM VALIDATION ---
const contactForm = document.getElementById('contact-form');
const successCard = document.getElementById('success-card');
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

const nameRegex = /^[a-zA-Z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
    if (!nameRegex.test(nameInput.value)) {
        nameError.classList.remove('hidden');
        nameInput.style.borderColor = '#ef4444'; 
        return false;
    }
    nameError.classList.add('hidden');
    nameInput.style.borderColor = 'rgba(0, 0, 0, 0.08)';
    return true;
}

function validateEmail() {
    if (emailInput.value.length > 0 && !emailRegex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        emailInput.style.borderColor = '#ef4444';
        return false;
    }
    emailError.classList.add('hidden');
    emailInput.style.borderColor = 'rgba(0, 0, 0, 0.08)';
    return true;
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);

// Handle Submit
window.handleFormSubmit = function(e) {
    e.preventDefault();
    if (!validateName()) return;
    if (!emailRegex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        emailInput.style.borderColor = '#ef4444';
        return;
    }

    const btn = document.getElementById('submit-btn');
    const btnSpan = btn.querySelector('span');
    const originalContent = btnSpan.innerHTML;
    btnSpan.innerHTML = 'Sending...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    const formData = new FormData(contactForm);
    const scriptURL = "https://script.google.com/macros/s/AKfycbzpiMd4qa0GFdUWKidiuBVJ6rJin8e6VGAJyNWeF0-jstYJIdlNA5hBaszWCbbJ8Ap3/exec";

    fetch(scriptURL, { method: "POST", body: formData })
    .then(() => triggerSuccessAnimation())
    .catch(error => {
        console.error('Error:', error);
        alert("Connection error. Please try again later.");
        btnSpan.innerHTML = originalContent;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
};

function triggerSuccessAnimation() {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(20px)';
    contactForm.style.pointerEvents = 'none';

    setTimeout(() => {
        contactForm.classList.add('hidden');
        successCard.classList.remove('hidden');
        void successCard.offsetWidth;
        successCard.classList.remove('scale-95', 'opacity-0');
        successCard.classList.add('scale-100', 'opacity-100');
        lucide.createIcons();
    }, 400); 
};

window.resetForm = function() {
    successCard.classList.remove('scale-100', 'opacity-100');
    successCard.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        successCard.classList.add('hidden');
        contactForm.classList.remove('hidden');
        contactForm.reset();
        void contactForm.offsetWidth;
        contactForm.style.opacity = '1';
        contactForm.style.transform = 'translateY(0)';
        contactForm.style.pointerEvents = 'auto';
    }, 400);
};

// --- DYNAMIC FAVICON ANIMATOR ---
(function() {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png'; link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);

    let angle = 0;

    function drawFavicon() {
        ctx.clearRect(0, 0, 32, 32);
        ctx.fillStyle = '#121212';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(0, 0, 32, 32, 8); else ctx.rect(0, 0, 32, 32);
        ctx.fill();

        ctx.fillStyle = '#EAB308';
        ctx.font = '900 20px "Manrope", sans-serif'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('S', 16, 17.5); 

        const radius = 12;
        const x = 16 + radius * Math.cos(angle);
        const y = 16 + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, 2 * Math.PI); 
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fill();
        
        link.href = canvas.toDataURL('image/png');
        angle += 0.12; 
        setTimeout(() => requestAnimationFrame(drawFavicon), 50); 
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
        drawFavicon();
    } else {
        ctx.fillStyle = '#121212';
        if (ctx.roundRect) ctx.roundRect(0, 0, 32, 32, 8); else ctx.rect(0,0,32,32);
        ctx.fill();
        ctx.fillStyle = '#EAB308';
        ctx.fillText('S', 16, 17.5);
        link.href = canvas.toDataURL('image/png');
    }
})();