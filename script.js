// ==================== PARTICLE SYSTEM ====================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();

      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.stroke();
          }
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==================== TYPING ANIMATION ====================
class TypeWriter {
  constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
    this.element = element;
    this.texts = texts;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.pauseDuration = pauseDuration;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      delay = 500;
    }

    setTimeout(() => this.type(), delay);
  }
}

// ==================== FLOATING HEARTS ====================
function createFloatingHearts() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;

  setInterval(() => {
    const heart = document.createElement('img');
    heart.src = 'media/heart-1.png';
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-50px';
    heart.style.width = Math.random() * 30 + 20 + 'px';
    heart.style.height = 'auto';
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.animation = `float-up ${Math.random() * 3 + 4}s linear forwards`;
    heart.style.pointerEvents = 'none';
    
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 7000);
  }, 2000);
}

// Float up animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float-up {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==================== PARALLAX EFFECT ====================
function initParallax() {
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const isIndexPage = document.querySelector('.hero-section') !== null;
  
  if (isIndexPage) {
    // Mouse parallax effect for landing page (index.html)
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      parallaxLayers.forEach((layer, index) => {
        const speed = 10 + (index * 5);
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        layer.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      // Heart parallax on mouse move
      const heart = document.querySelector('.heart');
      if (heart) {
        const x = (mouseX - 0.5) * 20;
        const y = (mouseY - 0.5) * 20;
        heart.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  } else {
    // Scroll parallax effect for love.html
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxLayers.forEach((layer, index) => {
        const speed = 0.2 + (index * 0.15);
        layer.style.transform = `translateY(${scrolled * speed}px)`;
      });
      
      // Parallax for decorative hearts
      document.querySelectorAll('.div-1, .div-2, .div-3').forEach((heart, index) => {
        const speed = 0.3 + (index * 0.1);
        heart.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
}

// ==================== SPARKLES EFFECT ====================
function createSparkles() {
  const container = document.querySelector('.sparkles-container');
  if (!container) return;

  setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 2000);
  }, 300);
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .tech-card, .about-card, .gallery-card, .message-card, .stat-card, .photo-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==================== HIDE SCROLL INDICATOR ====================
function hideScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.visibility = 'hidden';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.visibility = 'visible';
    }
  });
}

// ==================== CARD TILT EFFECT ====================
function initCardTilt() {
  const cards = document.querySelectorAll('.glass-card, .tech-card, .gallery-card, .photo-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ==================== RIPPLE EFFECT ON CLICK ====================
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  const rippleEffect = button.getElementsByClassName('ripple')[0];
  if (rippleEffect) {
    rippleEffect.remove();
  }

  button.appendChild(ripple);
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  button, .btn-primary, .reaction-btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(rippleStyle);

// ==================== PRELOADER ====================
function initPreloader() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = `
    <div class="preloader-content">
      <div class="heart-loader">❤️</div>
      <p>Loading love...</p>
    </div>
  `;
  
  document.body.prepend(preloader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

const preloaderStyle = document.createElement('style');
preloaderStyle.textContent = `
  .preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fc79ca 0%, #ff9ff3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: opacity 0.5s ease;
  }

  .preloader-content {
    text-align: center;
  }

  .heart-loader {
    font-size: 5rem;
    animation: heartbeat-loader 1s infinite;
  }

  .preloader p {
    color: white;
    font-size: 1.5rem;
    margin-top: 1rem;
  }

  @keyframes heartbeat-loader {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;
document.head.appendChild(preloaderStyle);

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    new ParticleSystem(canvas);
  }

  // Initialize all features
  createFloatingHearts();
  createSparkles();
  initSmoothScroll();
  initNavbarScroll();
  initScrollAnimations();
  
  // Only init parallax on love.html, not index.html
  if (!document.querySelector('.hero-section')) {
    initParallax();
  }
  
  initCardTilt();
  hideScrollIndicator();
  initPreloader();
  
  // Initialize gallery if on love.html
  if (document.getElementById('gallery-slider')) {
    initGallery();
  }

  // Add ripple effect to buttons
  document.querySelectorAll('button, .btn-primary, .reaction-btn').forEach(button => {
    button.addEventListener('click', createRipple);
  });

  // Performance optimization
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  }
});

// ==================== GOOGLE DRIVE GALLERY SYSTEM ====================
let currentPhotos = [];
let currentLightboxIndex = 0;

// Configuration
const DRIVE_CONFIG = {
  apiKey: 'AIzaSyBJup5gZIAgPQndubB3skf5EVVMug5mLLc',
  folderId: '1pvhBY5nxUTc6XeLXpdDJwas5P-_qqa-f',
  maxResults: 100
};

function initGallery() {
  console.log('Initializing Google Drive Gallery...');
  loadGoogleDriveAPI();
}

function loadGoogleDriveAPI() {
  const loadingElement = document.getElementById('gallery-loading');
  const errorElement = document.getElementById('gallery-error');
  
  console.log('Loading Google Drive API script...');
  
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  
  script.onload = () => {
    console.log('Google API script loaded successfully');
    gapi.load('client', initializeGoogleDrive);
  };
  
  script.onerror = () => {
    console.error('Failed to load Google API script');
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorElement) {
      errorElement.style.display = 'block';
      errorElement.innerHTML = `
        <i class="bi bi-exclamation-circle"></i>
        <p><strong>Error:</strong> Failed to load Google Drive API.</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check your internet connection and try again.</p>
      `;
    }
  };
  
  document.head.appendChild(script);
}

async function initializeGoogleDrive() {
  console.log('Initializing Google Drive client...');
  
  try {
    await gapi.client.init({
      apiKey: DRIVE_CONFIG.apiKey,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
    });
    
    console.log('Google Drive client initialized successfully');
    await loadPhotosFromDrive();
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    showGalleryError('Failed to initialize Google Drive: ' + error.message);
  }
}

async function loadPhotosFromDrive() {
  const loadingElement = document.getElementById('gallery-loading');
  const errorElement = document.getElementById('gallery-error');
  
  console.log('Fetching photos from Google Drive folder:', DRIVE_CONFIG.folderId);
  
  try {
    const response = await gapi.client.drive.files.list({
      q: `'${DRIVE_CONFIG.folderId}' in parents and mimeType contains 'image/'`,
      pageSize: DRIVE_CONFIG.maxResults,
      fields: 'files(id, name, mimeType, thumbnailLink, webContentLink)',
      orderBy: 'createdTime desc'
    });
    
    console.log('API Response:', response);
    const files = response.result.files;
    console.log('Files found:', files ? files.length : 0);
    
    if (files && files.length > 0) {
      // Log first file for debugging
      if (files[0]) {
        console.log('Sample file data:', files[0]);
      }
      
      currentPhotos = files.map(file => {
        // Use thumbnailLink if available (better for grid view), fallback to direct link
        const imageUrl = file.thumbnailLink 
          ? file.thumbnailLink.replace('=s220', '=s800') // Get higher quality thumbnail
          : `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
        
        return {
          src: imageUrl,
          fullSrc: `https://drive.google.com/uc?export=view&id=${file.id}`, // Full size for lightbox
          caption: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          id: file.id
        };
      });
      
      // Randomize/shuffle photos
      currentPhotos = shuffleArray(currentPhotos);
      
      console.log('Processed photos:', currentPhotos);
      displayGallery(currentPhotos);
      if (loadingElement) loadingElement.style.display = 'none';
    } else {
      throw new Error('No photos found in the Google Drive folder');
    }
  } catch (error) {
    console.error('Error loading photos:', error);
    
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorElement) {
      errorElement.style.display = 'block';
      
      let errorMessage = 'Unable to load photos from Google Drive.';
      let errorDetails = '';
      
      if (error.status === 403) {
        errorDetails = 'Access denied. Make sure the folder is shared with "Anyone with the link can view".';
      } else if (error.status === 404) {
        errorDetails = 'Folder not found. Please check the folder ID.';
      } else if (error.result && error.result.error) {
        errorDetails = error.result.error.message;
      } else {
        errorDetails = error.message;
      }
      
      errorElement.innerHTML = `
        <i class="bi bi-exclamation-circle"></i>
        <p><strong>Error:</strong> ${errorMessage}</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${errorDetails}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-pink); border: none; border-radius: 20px; color: white; cursor: pointer;">
          Try Again
        </button>
      `;
    }
  }
}

// Shuffle array helper function (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function displayGallery(photos) {
  const gallerySlider = document.getElementById('gallery-slider');
  const gallerySwiper = document.getElementById('gallery-swiper');
  const loadingElement = document.getElementById('gallery-loading');
  
  if (!gallerySlider) {
    console.error('Gallery slider element not found!');
    return;
  }
  
  console.log('Displaying', photos.length, 'photos in Swiper slider');
  
  // Hide loading and show slider
  if (loadingElement) {
    loadingElement.style.display = 'none';
    console.log('Loading hidden');
  }
  if (gallerySwiper) {
    gallerySwiper.style.display = 'block';
    console.log('Swiper container shown');
  }
  
  gallerySlider.innerHTML = '';
  
  // Create slider items
  photos.forEach((photo, index) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = index === 0 ? 'eager' : 'lazy';
    
    console.log(`Creating slide ${index + 1}: ${photo.caption}`);
    
    // Add error handling for broken images
    img.onerror = function() {
      console.error('Failed to load image:', photo.src);
      console.log('Trying alternative URL...');
      this.src = photo.fullSrc || `https://drive.google.com/uc?export=view&id=${photo.id}`;
      this.onerror = function() {
        console.error('Alternative URL also failed for:', photo.caption);
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23fc79ca" width="800" height="450"/%3E%3Ctext fill="%23fff" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage unavailable%3C/text%3E%3C/svg%3E';
        this.style.objectFit = 'contain';
      };
    };
    
    img.onload = function() {
      console.log(`Image loaded successfully: ${photo.caption}`);
    };
    
    slide.appendChild(img);
    slide.addEventListener('click', () => openLightbox(index));
    gallerySlider.appendChild(slide);
  });
  
  console.log('All slides created, initializing Swiper...');
  
  // Detect mobile for performance optimization
  const isMobile = window.innerWidth <= 768;
  
  // Initialize Swiper with optimized settings
  const swiper = new Swiper('.gallery-swiper', {
    effect: isMobile ? 'slide' : 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: isMobile ? 1 : 'auto',
    loop: photos.length > 1,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    coverflowEffect: isMobile ? {} : {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    speed: isMobile ? 400 : 600,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
    },
  });
  
  console.log('Swiper initialized successfully!');
}

function showGalleryError(message) {
  const loadingElement = document.getElementById('gallery-loading');
  const errorElement = document.getElementById('gallery-error');
  
  if (loadingElement) loadingElement.style.display = 'none';
  if (errorElement) {
    errorElement.style.display = 'block';
    errorElement.innerHTML = `
      <i class="bi bi-exclamation-circle"></i>
      <p><strong>Error:</strong> ${message}</p>
      <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-pink); border: none; border-radius: 20px; color: white; cursor: pointer;">
        Try Again
      </button>
    `;
  }
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  if (lightbox && lightboxImage && currentPhotos[index]) {
    lightbox.classList.add('active');
    // Use fullSrc for better quality in lightbox, fallback to src
    lightboxImage.src = currentPhotos[index].fullSrc || currentPhotos[index].src;
    if (lightboxCaption) {
      lightboxCaption.textContent = currentPhotos[index].caption || '';
    }
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = currentPhotos.length - 1;
  } else if (currentLightboxIndex >= currentPhotos.length) {
    currentLightboxIndex = 0;
  }
  
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  if (lightboxImage && currentPhotos[currentLightboxIndex]) {
    // Use fullSrc for better quality in lightbox, fallback to src
    lightboxImage.src = currentPhotos[currentLightboxIndex].fullSrc || currentPhotos[currentLightboxIndex].src;
    if (lightboxCaption) {
      lightboxCaption.textContent = currentPhotos[currentLightboxIndex].caption || '';
    }
  }
}

// Make functions globally accessible for inline onclick handlers
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;

