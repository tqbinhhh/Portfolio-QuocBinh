document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO CÁC BIẾN CẦN THIẾT ---
    const body = document.body;
    const header = document.querySelector('.header');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mainTitle = document.querySelector('.main-title');

    // --- 2. HIỆU ỨNG HEADER KHI CUỘN CHUỘT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. LOGIC CHUYỂN ĐỔI GIAO DIỆN (THEME) & NỀN HẠT ---

    // Cấu hình cho nền hạt ở GIAO DIỆN SÁNG
    const lightThemeParticlesConfig = {
        fpsLimit: 60,
        particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: "#a1a1a1" }, // Màu hạt xám cho nền sáng
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: { min: 1, max: 3 } },
            links: {
                color: "#a1a1a1", distance: 150, enable: true, opacity: 0.2, width: 1,
            },
            move: {
                enable: true, speed: 1, direction: "none", random: true,
                straight: false, outModes: "out",
            },
        },
        interactivity: { events: { onHover: { enable: false }, resize: true } },
        detectRetina: true,
    };

    // Cấu hình cho nền hạt ở GIAO DIỆN TỐI
    const darkThemeParticlesConfig = {
        fpsLimit: 60,
        particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: "#64ffda" }, // Màu xanh ngọc cho nền tối
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 2 } },
            links: {
                color: "#4a5568", distance: 150, enable: true, opacity: 0.2, width: 1,
            },
            move: {
                enable: true, speed: 1, direction: "none", random: true,
                straight: false, outModes: "out",
            },
        },
        interactivity: { events: { onHover: { enable: false }, resize: true } },
        detectRetina: true,
    };

    // Hàm để tải cấu hình nền hạt
    function loadParticles(config) {
        if (typeof tsParticles !== 'undefined') {
            tsParticles.load("tsparticles", config);
        }
    }

    // Hàm khởi tạo giao diện và nền hạt dựa trên lựa chọn đã lưu
    function initializeTheme() {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        if (isDarkMode) {
            body.classList.add('dark-theme');
            loadParticles(darkThemeParticlesConfig);
        } else {
            body.classList.remove('dark-theme');
            loadParticles(lightThemeParticlesConfig);
        }
    }
    
    // Gán sự kiện cho nút bấm đổi theme
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Hủy và tải lại nền hạt với cấu hình mới
        if (typeof tsParticles !== 'undefined') {
            const container = tsParticles.domItem(0);
            if (container) {
                container.destroy();
            }
            initializeTheme();
        }
    });

    // Chạy lần đầu khi tải trang
    initializeTheme();

    // --- 4. LOGIC MENU TRÊN DI ĐỘNG ---
    menuToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
        });
    });

    // --- 5. ANIMATION CHỮ CHO TIÊU ĐỀ CHÍNH ---
    if (mainTitle) {
        const textContent = mainTitle.textContent.trim();
        mainTitle.innerHTML = '';
        textContent.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            if (char === ' ') { span.innerHTML = '&nbsp;'; } 
            else { span.textContent = char; }
            mainTitle.appendChild(span);
        });
        setTimeout(() => {
            const chars = mainTitle.querySelectorAll('.char');
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('is-visible');
                }, index * 70);
            });
        }, 500);
    }

    // --- 6. HIỆU ỨNG "LƯỚT TỚI ĐÂU HIỆN TỚI ĐÓ" ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.staggerChildren !== undefined) {
                    const children = el.querySelectorAll('.reveal');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 120}ms`;
                    });
                }
                el.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));
    
    // --- 7. HIỆU ỨNG "VẼ" TIMELINE KHI CUỘN ---
    const timeline = document.querySelector('.timeline');
    if(timeline) {
        const timelineProgress = document.querySelector('.timeline-progress');
        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - timelineRect.top) / (window.innerHeight + timelineRect.height);
            const progressHeight = Math.min(Math.max(scrollPercent, 0), 1) * 100;
            if(timelineProgress) {
                timelineProgress.style.height = `${progressHeight}%`;
            }
        });
    }
});