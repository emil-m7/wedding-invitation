/* ═══ ИМЯ ГОСТЯ из URL (?name=Иван+и+Мария) ═══ */
(function () {
    var name = new URLSearchParams(location.search).get('name');
    if (name) document.getElementById('guestName').textContent = name;
})();

/* ═══ АНИМАЦИИ (IntersectionObserver) ═══ */
var animItems = document.querySelectorAll('[data-anim]');

var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animItems.forEach(function (el) { animObserver.observe(el); });

/* Первый экран — запустить сразу, не дожидаясь скролла */
document.querySelectorAll('#s0 [data-anim]').forEach(function (el) {
    el.classList.add('in');
});

/* ═══ НАВИГАЦИОННЫЕ ТОЧКИ ═══ */
var screens = Array.from(document.querySelectorAll('.screen'));
var dots    = Array.from(document.querySelectorAll('.nav-dot'));

var dotObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            var i = screens.indexOf(e.target);
            dots.forEach(function (d) { d.classList.remove('on'); });
            if (dots[i]) dots[i].classList.add('on');
        }
    });
}, { threshold: 0.5 });

screens.forEach(function (s) { dotObserver.observe(s); });

dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
        var idx = parseInt(dot.dataset.to, 10);
        if (screens[idx]) screens[idx].scrollIntoView({ behavior: 'smooth' });
    });
});

/* ═══ МУЗЫКА ═══ */
var audio     = document.getElementById('bgMusic');
var musicBtn  = document.getElementById('musicBtn');
var iconPlay  = document.getElementById('iconPlay');
var iconPause = document.getElementById('iconPause');
var playing   = false;

/* Скрыть кнопку, если источник не указан */
if (!audio.querySelector('source')) {
    musicBtn.style.display = 'none';
}

function startMusic() {
    audio.play().then(function () {
        playing = true;
        musicBtn.classList.remove('off');
        iconPlay.style.display  = 'none';
        iconPause.style.display = '';
    }).catch(function () {});
}

musicBtn.addEventListener('click', function () {
    if (playing) {
        audio.pause();
        playing = false;
        musicBtn.classList.add('off');
        iconPlay.style.display  = '';
        iconPause.style.display = 'none';
    } else {
        startMusic();
    }
});

/* Попытка автовоспроизведения при первом касании */
function tryAutoplay() {
    if (!playing && audio.querySelector('source')) startMusic();
}
document.addEventListener('touchstart', tryAutoplay, { once: true, passive: true });
document.addEventListener('click',      tryAutoplay, { once: true });
