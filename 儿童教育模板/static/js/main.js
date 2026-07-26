/* ========================================
   星悦幼儿园 - 主JavaScript文件
   ======================================== */

(function () {
    'use strict';

    // ===== DOM 元素缓存 =====
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('backToTop');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const heroDots = document.querySelectorAll('.hero-dots .dot');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const admissionForm = document.getElementById('admissionForm');
    const subscribeForm = document.getElementById('subscribeForm');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ===== 滚动监听 - 头部样式变化 =====
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 头部样式
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 回到顶部按钮
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // 导航高亮
        updateActiveNav(scrollTop);

        lastScrollTop = scrollTop;
    }, { passive: true });

    // ===== 回到顶部 =====
    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== 移动端菜单切换 =====
    mobileToggle.addEventListener('click', function () {
        mainNav.classList.toggle('active');
        const spans = this.querySelectorAll('span');
        if (mainNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // ===== 平滑滚动 & 导航高亮 =====
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // 关闭移动端菜单
            mainNav.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ===== 导航高亮更新 =====
    function updateActiveNav(scrollTop) {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ===== 英雄区域轮播 =====
    let currentSlide = 0;
    const slideCount = heroSlides.length;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slideCount);
    }

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 点击圆点切换
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // ===== 家长感言轮播 =====
    let currentTestimonial = 0;
    const testimonialCount = testimonialCards.length;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentTestimonial = index;
    }

    function nextTestimonial() {
        showTestimonial((currentTestimonial + 1) % testimonialCount);
    }

    // 自动轮播
    setInterval(nextTestimonial, 6000);

    // 点击圆点切换
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    // ===== 数字动画 =====
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (target > 100 ? '+' : '');
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats(); // 初始检查

    // ===== 招生表单提交 =====
    if (admissionForm) {
        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const parentName = document.getElementById('parentName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const childName = document.getElementById('childName').value.trim();
            const childAge = document.getElementById('childAge').value;
            const message = document.getElementById('message').value.trim();

            // 简单验证
            if (!parentName) {
                showAlert('请输入家长姓名', 'warning');
                return;
            }

            if (!phone || phone.length < 11) {
                showAlert('请输入正确的手机号码', 'warning');
                return;
            }

            // 模拟提交
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '提交中...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '✓ 提交成功';
                btn.style.background = '#4ECDC4';

                showAlert('预约成功！我们会尽快与您联系。', 'success');

                // 重置表单
                setTimeout(() => {
                    admissionForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 2000);
            }, 1500);
        });
    }

    // ===== 订阅表单提交 =====
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!email || !isValidEmail(email)) {
                showAlert('请输入有效的邮箱地址', 'warning');
                return;
            }

            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '订阅中...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = '✓ 已订阅';
                btn.style.background = '#4ECDC4';

                showAlert('订阅成功！感谢您的关注。', 'success');

                setTimeout(() => {
                    subscribeForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 2000);
            }, 1200);
        });
    }

    // ===== 工具函数 =====
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        // 创建提示框
        const alert = document.createElement('div');
        alert.className = 'custom-alert custom-alert-' + type;
        alert.textContent = message;

        // 添加样式
        Object.assign(alert.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '500',
            zIndex: '9999',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            background: type === 'success' ? '#4ECDC4' : '#FF6B6B'
        });

        document.body.appendChild(alert);

        // 动画进入
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 10);

        // 自动移除
        setTimeout(() => {
            alert.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 3000);
    }

    // ===== 滚动动画观察器 =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.feature-card, .curriculum-card, .class-card, .why-choose-item, .team-card, .news-card'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ===== 页面加载完成 =====
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // 触发初始动画
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
            }
        }, 100);
    });

    // ===== 键盘导航支持 =====
    document.addEventListener('keydown', function (e) {
        // ESC 关闭移动菜单
        if (e.key === 'Escape') {
            mainNav.classList.remove('active');
        }

        // 左右箭头切换轮播
        if (e.key === 'ArrowLeft') {
            showSlide((currentSlide - 1 + slideCount) % slideCount);
        }
        if (e.key === 'ArrowRight') {
            showSlide((currentSlide + 1) % slideCount);
        }
    });

})();