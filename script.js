document.addEventListener('DOMContentLoaded', () => {

    // 1. 마우스 트레일러 (Lerp)
    const trailer = document.getElementById('mouse-trailer');
    let mouseX = 0, mouseY = 0, trailerX = 0, trailerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrailer() {
        trailerX += (mouseX - trailerX) * 0.08;
        trailerY += (mouseY - trailerY) * 0.08;
        if (trailer) {
            trailer.style.left = `${trailerX}px`;
            trailer.style.top = `${trailerY}px`;
        }
        requestAnimationFrame(animateTrailer);
    }
    animateTrailer();

    // 2. 캐러셀 시스템
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const titleText = document.getElementById('carousel-title');
    const counterText = document.getElementById('carousel-counter');
    const dotsContainer = document.getElementById('carousel-dots');

    const slidesData = [
        { title: "게이미피케이션 기획" },
        { title: "우마무스메 튜토리얼 개선 기획" },
        { title: "겟앰프드 캐릭터 기획" },
        { title: "팀 프로젝트 인벤토리 기획" },
        { title: "웹툰 IP 기반 모바일 게임 제안서" }
    ];

    let currentIndex = 0;
    const maxSlides = slidesData.length;

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
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

        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
        nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
    }

    createDots();
    updateCarousel(0);

    // 3. Contact 폼 - FormSubmit AJAX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
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
                    alert('소중한 연락 감사드립니다! 메시지가 게임기획자 김태윤에게 안전하게 전달되었습니다. 확인 후 기재해주신 이메일로 신속하게 답변드리겠습니다. 😊');
                    contactForm.reset();
                } else {
                    alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
                }
            } catch {
                alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 4. 방문자 수 카운터 (Abacus 서버 공유 카운터 - PC/모바일 동일 집계)
    // 이전에 쓰던 CounterAPI v1이 서비스 종료(410 Gone)되어 Abacus로 교체.
    // 인증 키가 필요 없고 CORS가 열려 있어 정적 배포만으로 동작한다.
    // 응답 형식: { "value": 숫자 } / 미존재 키 조회 시 404
    const todayElem = document.getElementById('today-count');
    const totalElem = document.getElementById('total-count');

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

                todayElem.textContent = todayData.value;
                totalElem.textContent = totalData.value;
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