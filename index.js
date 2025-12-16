document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navbar = document.querySelector('.Navbar');
    const navLinks = Array.from(document.querySelectorAll('#Nav a'));
    const sections = Array.from(document.querySelectorAll('section')).filter(section => section.id);
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('.theme-icon');
    const themeText = themeToggleBtn?.querySelector('.theme-text');

    const THEME_KEY = 'preferred-theme';
    const getPreferredTheme = () => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setToggleCopy = (theme) => {
        if (!themeIcon || !themeText) return;
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark mode';
        }
    };

    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        setToggleCopy(theme);
    };

    applyTheme(getPreferredTheme());

    const setNavbarState = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 12);
    };

    const scrollToTarget = (target) => {
        const navOffset = navbar?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset + 8;
        window.scrollTo({
            top,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            scrollToTarget(target);
            link.blur();
        });
    });

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
            link.setAttribute('aria-current', matches ? 'true' : 'false');
        });
    };

    if (sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target.id) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.35,
                rootMargin: '-10% 0px -45% 0px',
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    const revealTargets = [
        ...sections,
        document.querySelector('.Profile img'),
        document.querySelector('#p1'),
        ...document.querySelectorAll('.Projects > div'),
        document.querySelector('.Contacts'),
    ].filter(Boolean);

    if (revealTargets.length) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        revealTargets.forEach((el) => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    const scrollTopButton = document.createElement('button');
    scrollTopButton.type = 'button';
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.setAttribute('aria-label', 'Back to top');
    scrollTopButton.innerHTML = '↑';
    document.body.appendChild(scrollTopButton);

    const toggleScrollTop = () => {
        scrollTopButton.classList.toggle('visible', window.scrollY > 420);
    };

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    });

    const projectCards = document.querySelectorAll('.Projects > div');
    projectCards.forEach((card) => {
        const primaryLink = card.querySelector('a');
        if (!primaryLink) return;

        const goToProject = () => primaryLink.click();

        card.addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() === 'a') return;
            goToProject();
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToProject();
            }
        });
    });

    const emailLink = document.querySelector('.email a[href^="mailto:"]');
    if (emailLink) {
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'copy-email';
        copyButton.textContent = 'Copy email';
        emailLink.after(copyButton);

        copyButton.addEventListener('click', async () => {
            const email = emailLink.textContent.trim();
            try {
                await navigator.clipboard.writeText(email);
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.textContent = 'Copy email';
                    copyButton.classList.remove('copied');
                }, 1600);
            } catch (error) {
                copyButton.textContent = 'Press Ctrl+C';
            }
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    setNavbarState();
    toggleScrollTop();

    window.addEventListener('scroll', () => {
        setNavbarState();
        toggleScrollTop();
    });
});
