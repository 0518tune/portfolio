/* ============================================================================
   게임기획자 김태윤 포트폴리오 — 인터랙션 스크립트
   ----------------------------------------------------------------------------
   1. 유틸 (모션 설정 · 포커스 · 토스트)
   2. 마우스 트레일러
   3. 모바일 메뉴 / 스크롤 진행바 / 현재 섹션 하이라이트
   4. 스크롤 등장 연출
   5. 프로토타입 캐러셀 (버튼 · 스와이프 · 키보드) + 라이트박스
   6. 다운로드 확인 모달
   7. Contact 폼
   8. 방문자 수 카운터
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. 유틸 ─────────────────────────────────────────────────────────── */

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const ICONS = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        error:   '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>',
        info:    '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    };

    const toastWrap = document.getElementById('toast-wrap');

    function toast(message, type = 'info', ms = 4200) {
        if (!toastWrap) { console.log(message); return; }
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.setAttribute('role', type === 'error' ? 'alert' : 'status');
        el.innerHTML =
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">${ICONS[type] || ICONS.info}</svg>` +
            `<span></span>`;
        el.querySelector('span').textContent = message;
        toastWrap.appendChild(el);
        const remove = () => {
            el.classList.add('is-leaving');
            el.addEventListener('animationend', () => el.remove(), { once: true });
            setTimeout(() => el.remove(), 400);
        };
        const timer = setTimeout(remove, ms);
        el.addEventListener('click', () => { clearTimeout(timer); remove(); });
    }

    // 오버레이(모달·라이트박스) 공통 열기/닫기 — 포커스 복원과 ESC 처리를 담당한다
    let lastFocused = null;
    const openOverlays = [];

    function openOverlay(el, focusTarget) {
        lastFocused = document.activeElement;
        el.hidden = false;
        document.body.classList.add('menu-open');   // 배경 스크롤 잠금
        openOverlays.push(el);
        if (focusTarget) focusTarget.focus();
    }

    function closeOverlay(el) {
        el.hidden = true;
        const i = openOverlays.indexOf(el);
        if (i > -1) openOverlays.splice(i, 1);
        if (!openOverlays.length) document.body.classList.remove('menu-open');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // data-close 가 붙은 요소(배경·취소·닫기 버튼)는 자동으로 오버레이를 닫는다
    document.querySelectorAll('.overlay').forEach((ov) => {
        ov.querySelectorAll('[data-close]').forEach((btn) => {
            btn.addEventListener('click', () => closeOverlay(ov));
        });
    });


    /* ── 2. 마우스 트레일러 ──────────────────────────────────────────────── */
    // 터치 기기와 '모션 최소화' 설정에서는 rAF 루프 자체를 돌리지 않는다 (배터리 절약)

    const trailer = document.getElementById('mouse-trailer');
    if (trailer && finePointer && !reduceMotion) {
        let mouseX = 0, mouseY = 0, trailerX = 0, trailerY = 0;
        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        (function animateTrailer() {
            trailerX += (mouseX - trailerX) * 0.08;
            trailerY += (mouseY - trailerY) * 0.08;
            trailer.style.transform = `translate3d(${trailerX}px, ${trailerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateTrailer);
        })();
    } else if (trailer) {
        trailer.remove();
    }


    /* ── 3. 내비게이션 ───────────────────────────────────────────────────── */

    const nav = document.querySelector('nav');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('nav-icon-open');
    const iconClose = document.getElementById('nav-icon-close');

    // 모바일 메뉴가 GNB 바로 아래에 붙도록 실제 높이를 CSS 변수로 넘긴다
    const syncNavHeight = () => {
        if (nav) document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
    };
    syncNavHeight();
    window.addEventListener('resize', syncNavHeight);

    function setMenu(open) {
        if (!mobileMenu || !navToggle) return;
        mobileMenu.hidden = !open;
        mobileMenu.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
        if (iconOpen) iconOpen.classList.toggle('hidden', open);
        if (iconClose) iconClose.classList.toggle('hidden', !open);
        document.body.classList.toggle('menu-open', open);
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => setMenu(mobileMenu.hidden));
        mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
        // 데스크톱 폭으로 돌아가면 열려 있던 메뉴를 정리한다
        window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    }

    // ── 스크롤에 반응하는 것들을 rAF 한 번에 묶어 처리한다 ──
    // (진행바 · GNB 축약 · 히어로 패럴랙스 · 맨 위로 버튼)
    const progress = document.getElementById('scroll-progress');
    const progressHead = document.getElementById('scroll-progress-head');
    const heroInner = document.getElementById('hero-inner');
    const heroHint = document.getElementById('hero-scroll-hint');
    const backToTop = document.getElementById('back-to-top');

    let ticking = false;
    let navScrolled = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(y / max, 1) : 0;

        if (progress) {
            progress.style.transform = `scaleX(${ratio})`;
            progress.classList.toggle('is-active', ratio > 0.002);
            // 막대가 scaleX 로 눌리는 만큼 헤드를 역보정해 동그란 모양을 유지한다
            if (progressHead && ratio > 0) {
                progressHead.style.setProperty('--head-fix', String(1 / Math.max(ratio, 0.02)));
            }
        }

        // GNB 축약 — 상태가 바뀔 때만 클래스를 건드린다
        const shouldShrink = y > 40;
        if (nav && shouldShrink !== navScrolled) {
            navScrolled = shouldShrink;
            nav.classList.toggle('is-scrolled', shouldShrink);
            syncNavHeight();
        }

        // 히어로 패럴랙스 — 첫 화면을 지나면 계산을 멈춘다
        if (heroInner && !reduceMotion && y < window.innerHeight * 1.1) {
            heroInner.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
            heroInner.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.72), 0));
        }
        if (heroHint) heroHint.style.opacity = String(Math.max(1 - y / 240, 0));

        // 맨 위로 버튼
        if (backToTop) {
            const show = y > window.innerHeight * 0.9;
            if (show && backToTop.hidden) {
                backToTop.hidden = false;
                requestAnimationFrame(() => backToTop.classList.add('is-visible'));
            } else if (!show && !backToTop.hidden) {
                backToTop.classList.remove('is-visible');
                setTimeout(() => { if (!backToTop.classList.contains('is-visible')) backToTop.hidden = true; }, 320);
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', () => { ticking = false; onScroll(); }, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    // 현재 보고 있는 섹션을 GNB 에 표시
    const navLinks = document.querySelectorAll('[data-nav]');
    const sections = document.querySelectorAll('section[id]');
    if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
        const visible = new Map();
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
            let topId = null, topRatio = 0;
            visible.forEach((ratio, id) => { if (ratio > topRatio) { topRatio = ratio; topId = id; } });
            if (topId) {
                navLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === topId));
            }
        }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-76px 0px -40% 0px' });
        sections.forEach((s) => spy.observe(s));
    }


    /* ── 4. 스크롤 등장 연출 ─────────────────────────────────────────────── */

    const revealEls = document.querySelectorAll('[data-reveal]');
    const sectionTitles = document.querySelectorAll('.section-title');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-revealed', 'reveal-done'));
        sectionTitles.forEach((el) => el.classList.add('title-in'));
    } else {
        // 같은 부모 안에서 순서대로 살짝씩 늦게 등장시켜 카드가 흐르듯 나타나게 한다
        const seen = new Map();
        revealEls.forEach((el) => {
            const key = el.parentElement;
            const idx = seen.get(key) || 0;
            seen.set(key, idx + 1);
            el.style.setProperty('--reveal-delay', `${Math.min(idx, 6) * 90}ms`);
        });

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                el.classList.add('is-revealed');
                obs.unobserve(el);
                // 연출이 끝나면 blur 필터를 걷어 내 텍스트 선명도를 되돌린다
                el.addEventListener('transitionend', function done(ev) {
                    if (ev.target !== el || ev.propertyName !== 'filter') return;
                    el.removeEventListener('transitionend', done);
                    el.classList.add('reveal-done');
                });
                // transitionend 가 안 오는 경우(탭 전환 등)를 대비한 보험
                setTimeout(() => el.classList.add('reveal-done'), 1800);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach((el) => io.observe(el));

        // 섹션 타이틀 밑줄을 따로 관찰한다 (헤더 묶음 밖에 있는 타이틀도 있어서)
        const titleIo = new IntersectionObserver((entries, obs) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add('title-in');
                obs.unobserve(e.target);
            });
        }, { threshold: 0.6 });
        sectionTitles.forEach((el) => titleIo.observe(el));
    }


    /* ── 5. 캐러셀 + 라이트박스 ──────────────────────────────────────────── */

    const carousel = document.getElementById('carousel');
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const zoomBtn = document.getElementById('zoom-btn');
    const titleText = document.getElementById('carousel-title');
    const counterText = document.getElementById('carousel-counter');
    const dotsContainer = document.getElementById('carousel-dots');

    const slidesData = [
        { title: '게이미피케이션 기획' },
        { title: '우마무스메 튜토리얼 개선 기획' },
        { title: '겟앰프드 캐릭터 기획' },
        { title: '팀 프로젝트 인벤토리 기획' },
        { title: '웹툰 IP 기반 모바일 게임 제안서' }
    ];

    let currentIndex = 0;
    const maxSlides = slidesData.length;

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `${i + 1}번째 슬라이드: ${slidesData[i].title}`);
            dot.addEventListener('click', () => updateCarousel(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel(index) {
        if (!track) return;
        if (index < 0) currentIndex = maxSlides - 1;
        else if (index >= maxSlides) currentIndex = 0;
        else currentIndex = index;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        if (titleText) titleText.textContent = slidesData[currentIndex].title;
        if (counterText) counterText.textContent = `${currentIndex + 1} / ${maxSlides}`;
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
                dot.setAttribute('aria-current', String(idx === currentIndex));
            });
        }
        if (lightbox && !lightbox.hidden) renderLightbox();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

    // 키보드 좌우 이동 (캐러셀에 포커스가 있을 때)
    if (carousel) {
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); updateCarousel(currentIndex - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); updateCarousel(currentIndex + 1); }
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
        });

        // 모바일 스와이프 — 세로 스크롤과 충돌하지 않도록 가로 이동이 우세할 때만 넘긴다
        let sx = 0, sy = 0, swiping = false;
        carousel.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            sx = t.clientX; sy = t.clientY; swiping = true;
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - sx, dy = t.clientY - sy;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                updateCarousel(currentIndex + (dx < 0 ? 1 : -1));
            }
        }, { passive: true });
    }

    createDots();

    // ── 라이트박스 ──
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbSource = document.getElementById('lb-source');
    const lbCaption = document.getElementById('lb-caption');

    // 캐러셀 슬라이드에서 원본/WebP 경로를 그대로 가져온다
    const slideSources = track
        ? Array.from(track.querySelectorAll('picture')).map((pic) => ({
            webp: pic.querySelector('source')?.getAttribute('srcset') || '',
            fallback: pic.querySelector('img')?.getAttribute('src') || '',
            alt: pic.querySelector('img')?.getAttribute('alt') || ''
        }))
        : [];

    function renderLightbox() {
        const src = slideSources[currentIndex];
        if (!src || !lbImg) return;
        if (lbSource) lbSource.srcset = src.webp;
        lbImg.src = src.fallback;
        lbImg.alt = src.alt;
        if (lbCaption) lbCaption.textContent = `${currentIndex + 1} / ${maxSlides} · ${slidesData[currentIndex].title}`;
    }

    function openLightbox() {
        if (!lightbox || !slideSources.length) return;
        renderLightbox();
        openOverlay(lightbox, document.getElementById('lb-next'));
    }

    if (lightbox) {
        if (zoomBtn) zoomBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(); });
        if (track) track.addEventListener('click', openLightbox);
        document.getElementById('lb-prev')?.addEventListener('click', () => updateCarousel(currentIndex - 1));
        document.getElementById('lb-next')?.addEventListener('click', () => updateCarousel(currentIndex + 1));
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
            if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
        });
    }

    updateCarousel(0);


    /* ── 6. 다운로드 확인 모달 ───────────────────────────────────────────── */

    const dlModal = document.getElementById('dl-modal');
    const dlIcon = document.getElementById('dl-icon');
    const dlName = document.getElementById('dl-name');
    const dlType = document.getElementById('dl-type');
    const dlSize = document.getElementById('dl-size');
    const dlWarn = document.getElementById('dl-warn');
    const dlConfirm = document.getElementById('dl-confirm');

    const FILE_TYPES = {
        pdf:  { label: 'PDF 문서', badge: 'PDF' },
        pptx: { label: 'PowerPoint 발표자료', badge: 'PPTX' },
        ppt:  { label: 'PowerPoint 발표자료', badge: 'PPT' },
        xlsx: { label: 'Excel 스프레드시트', badge: 'XLSX' },
        zip:  { label: '압축 파일', badge: 'ZIP' }
    };
    const LARGE_FILE_BYTES = 20 * 1024 * 1024;   // 20MB 이상이면 Wi-Fi 권장 경고

    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) return null;
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    let pendingDownload = null;

    async function askDownload(href, filename) {
        const ext = (filename.split('.').pop() || '').toLowerCase();
        const meta = FILE_TYPES[ext] || { label: ext.toUpperCase() + ' 파일', badge: ext.toUpperCase().slice(0, 4) };

        pendingDownload = { href, filename };
        dlIcon.textContent = meta.badge;
        dlName.textContent = filename;
        dlType.textContent = meta.label;
        dlSize.textContent = '확인 중…';
        dlWarn.hidden = true;

        openOverlay(dlModal, dlConfirm);

        // 같은 오리진이라 HEAD 요청으로 실제 용량을 그대로 읽을 수 있다
        try {
            const res = await fetch(href, { method: 'HEAD' });
            const len = Number(res.headers.get('content-length'));
            const pretty = formatBytes(len);
            // 모달이 이미 닫혔거나 다른 파일로 바뀌었으면 갱신하지 않는다
            if (!pendingDownload || pendingDownload.href !== href) return;
            dlSize.textContent = pretty || '알 수 없음';
            dlWarn.hidden = !(len >= LARGE_FILE_BYTES);
        } catch {
            if (pendingDownload && pendingDownload.href === href) dlSize.textContent = '알 수 없음';
        }
    }

    if (dlModal && dlConfirm) {
        document.querySelectorAll('a[download]').forEach((link) => {
            link.addEventListener('click', (e) => {
                // 새 탭/새 창으로 여는 조작은 원래 동작 그대로 둔다
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                const filename = link.getAttribute('download') ||
                    decodeURIComponent((link.getAttribute('href') || '').split('/').pop() || '파일');
                askDownload(link.href, filename);
            });
        });

        dlConfirm.addEventListener('click', () => {
            if (!pendingDownload) return;
            const { href, filename } = pendingDownload;
            // 브라우저 기본 다운로드 관리자에 넘긴다.
            // blob 으로 직접 받으면 70MB 파일이 통째로 메모리에 올라가 모바일에서 위험하다.
            const a = document.createElement('a');
            a.href = href;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            closeOverlay(dlModal);
            pendingDownload = null;
            toast(`'${filename}' 다운로드를 시작했습니다.`, 'success');
        });
    }


    /* ── ESC 로 열린 오버레이 닫기 ───────────────────────────────────────── */

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (openOverlays.length) {
            closeOverlay(openOverlays[openOverlays.length - 1]);
        } else if (mobileMenu && !mobileMenu.hidden) {
            setMenu(false);
            navToggle?.focus();
        }
    });


    /* ── 7. Contact 폼 ───────────────────────────────────────────────────── */

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 허니팟: 사람에게는 보이지 않는 필드라 값이 있으면 봇으로 간주하고 조용히 성공 처리
            if (contactForm.querySelector('[name="_honey"]')?.value) {
                contactForm.reset();
                toast('메시지가 전송되었습니다.', 'success');
                return;
            }

            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '전송 중...';
            submitBtn.disabled = true;

            const data = {
                name: contactForm.querySelector('[name="name"]').value,
                email: contactForm.querySelector('[name="email"]').value,
                message: contactForm.querySelector('[name="message"]').value
            };

            try {
                const res = await fetch('https://formsubmit.co/ajax/0518tune@gmail.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    toast('메시지가 전달되었습니다. 확인 후 기재해주신 이메일로 답변드리겠습니다. 감사합니다!', 'success', 6000);
                    contactForm.reset();
                } else {
                    toast('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
                }
            } catch {
                toast('전송 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }


    /* ── 8. 방문자 수 카운터 ─────────────────────────────────────────────── */
    // Abacus 공유 카운터 (인증 불필요 · CORS 개방 · 정적 배포만으로 동작)
    // 응답 형식: { "value": 숫자 } / 미존재 키 조회 시 404

    const todayElem = document.getElementById('today-count');
    const totalElem = document.getElementById('total-count');

    // 0 에서 목표 숫자까지 굴러 올라가는 연출
    function countUp(el, target) {
        const value = Number(target);
        if (!Number.isFinite(value)) { el.textContent = target; return; }
        if (reduceMotion) { el.textContent = value.toLocaleString(); return; }
        const duration = 900;
        const start = performance.now();
        (function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(value * eased).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
        })(start);
    }

    if (todayElem && totalElem) {
        (async () => {
            const BASE = 'https://abacus.jasoncameron.dev';
            const NAMESPACE = 'kimtaeyun-game-portfolio';

            // "오늘"의 기준을 방문자 로컬 시간대가 아니라 KST(UTC+9)로 고정한다.
            // 해외에서 접속해도 국내 기준과 같은 날짜 버킷에 집계되도록 하기 위함.
            const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
            const today = kstNow.toISOString().slice(0, 10); // YYYY-MM-DD
            const todayKey = `daily-${today}`;
            const LAST_VISIT_KEY = 'visit_last_date';

            // 같은 브라우저에서 당일 이미 집계했으면 증가 없이 조회만 (새로고침 중복 집계 방지)
            const shouldIncrement = localStorage.getItem(LAST_VISIT_KEY) !== today;
            const verb = shouldIncrement ? 'hit' : 'get';

            // 응답을 기다리는 사이에 새로고침/다중 탭으로 중복 증가하는 것을 막기 위해 먼저 기록한다.
            // 요청이 실패하면 아래 catch에서 되돌려 다음 방문에 다시 시도한다.
            if (shouldIncrement) localStorage.setItem(LAST_VISIT_KEY, today);

            try {
                const [totalRes, todayRes] = await Promise.all([
                    fetch(`${BASE}/${verb}/${NAMESPACE}/total`, { cache: 'no-store' }),
                    fetch(`${BASE}/${verb}/${NAMESPACE}/${todayKey}`, { cache: 'no-store' })
                ]);
                if (!totalRes.ok || !todayRes.ok) throw new Error('visitor api response not ok');

                const [totalData, todayData] = await Promise.all([totalRes.json(), todayRes.json()]);
                if (typeof todayData.value !== 'number' || typeof totalData.value !== 'number') {
                    throw new Error('visitor api returned invalid payload');
                }

                countUp(todayElem, todayData.value);
                countUp(totalElem, totalData.value);
                localStorage.setItem('visit_today_cache', todayData.value);
                localStorage.setItem('visit_total_cache', totalData.value);
            } catch (err) {
                // 실패 시 선기록을 되돌려 다음 방문에 다시 집계되게 한다
                if (shouldIncrement) localStorage.removeItem(LAST_VISIT_KEY);
                // 네트워크 오류 시 마지막으로 표시된 값을 유지 (PC/모바일 모두 동일 캐시 값 기준)
                const cachedToday = localStorage.getItem('visit_today_cache');
                const cachedTotal = localStorage.getItem('visit_total_cache');
                if (cachedToday) todayElem.textContent = cachedToday;
                if (cachedTotal) totalElem.textContent = cachedTotal;
            }
        })();
    }
});
