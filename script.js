        const cursor = document.getElementById('cursor');
        const cursorRing = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
        });
        function animRing() {
            rx += (mx - rx) * .12;
            ry += (my - ry) * .12;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';
            requestAnimationFrame(animRing);
        }
        animRing();
        document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; cursorRing.style.opacity = 0 });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = 1; cursorRing.style.opacity = 1 });

        document.querySelectorAll('.page').forEach(p => {
            p.addEventListener('scroll', () => {
                const nav = document.getElementById('mainNav');
                if (p.scrollTop > 40) nav.classList.add('scrolled');
                else nav.classList.remove('scrolled');
            });
        });

        let currentPage = 'home';
        function navigateTo(pageId) {
            if (pageId === currentPage) return;
            const pt = document.getElementById('pageTransition');
            pt.classList.add('active');
            setTimeout(() => {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                document.getElementById(pageId).scrollTop = 0;
                currentPage = pageId;
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.dataset.page === pageId);
                });
                observeRevealElements();
                pt.classList.remove('active');
                pt.classList.add('out');
                setTimeout(() => pt.classList.remove('out'), 500);
                animateCounters();
            }, 400);
        }

        let observer;
        function observeRevealElements() {
            if (observer) observer.disconnect();
            const page = document.querySelector('.page.active');
            const els = page.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
            observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('visible');
                    } else {
                        e.target.classList.remove('visible');
                    }
                });
            }, { threshold: .12, rootMargin: '0px 0px -40px 0px', root: page });
            els.forEach(el => observer.observe(el));
        }
        observeRevealElements();
        document.querySelectorAll('.page').forEach(p => {
            p.addEventListener('scroll', () => {
                if (p.classList.contains('active')) {
                    if (observer) observer.disconnect();
                    observeRevealElements();
                }
            });
        });

        function animateCounters() {
            const page = document.querySelector('.page.active');
            page.querySelectorAll('[data-count]').forEach(el => {
                const target = +el.dataset.count;
                let start = 0;
                const step = () => {
                    start += Math.ceil(target / 40);
                    if (start >= target) { el.textContent = target + ''; return; }
                    el.textContent = start;
                    setTimeout(step, 30);
                };
                step();
            });
        }
        animateCounters();

        const heroDesc = document.querySelector('.hero-desc');
        if (heroDesc) {
            const txt = heroDesc.innerHTML;
            heroDesc.style.opacity = 1;
        }

        function filterProjects(cat, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.project-card').forEach(card => {
                const c = card.dataset.category;
                if (cat === 'all' || c === cat) {
                    card.style.display = '';
                    setTimeout(() => { card.style.opacity = 1; card.style.transform = '' }, 50);
                } else {
                    card.style.opacity = 0;
                    card.style.transform = 'scale(.95)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        }

        function submitForm() {
            const fname = document.getElementById('fname').value;
            const femail = document.getElementById('femail').value;
            if (!fname || !femail) {
                document.getElementById('fname').style.borderColor = 'var(--accent2)';
                document.getElementById('femail').style.borderColor = 'var(--accent2)';
                setTimeout(() => {
                    document.getElementById('fname').style.borderColor = '';
                    document.getElementById('femail').style.borderColor = '';
                }, 1500);
                return;
            }
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
        }

        (function () {
            const spans = document.querySelectorAll('.hero-name span');
            spans.forEach((s, i) => {
                s.style.opacity = 0;
                s.style.transform = 'translateY(60px)';
                s.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)';
                s.style.transitionDelay = (0.3 + i * 0.15) + 's';
                setTimeout(() => { s.style.opacity = 1; s.style.transform = 'translateY(0)' }, 50);
            });
            const desc = document.querySelector('.hero-desc');
            if (desc) {
                desc.style.opacity = 0; desc.style.transform = 'translateY(20px)';
                desc.style.transition = 'opacity .8s,transform .8s';
                desc.style.transitionDelay = '.8s';
                setTimeout(() => { desc.style.opacity = 1; desc.style.transform = 'translateY(0)' }, 50);
            }
            const actions = document.querySelector('.hero-actions');
            if (actions) {
                actions.style.opacity = 0; actions.style.transform = 'translateY(20px)';
                actions.style.transition = 'opacity .8s,transform .8s';
                actions.style.transitionDelay = '1s';
                setTimeout(() => { actions.style.opacity = 1; actions.style.transform = 'translateY(0)' }, 50);
            }
        })();