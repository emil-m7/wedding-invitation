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

/* ═══ МУЗЫКА (YouTube iframe) ═══ */
var YT_VIDEO_ID = 'ZoVcKf16Gbk';  // ← ID видео с YouTube

var ytPlayer  = document.getElementById('ytPlayer');
var musicBtn  = document.getElementById('musicBtn');
var iconPlay  = document.getElementById('iconPlay');
var iconPause = document.getElementById('iconPause');
var playing   = false;
var loaded    = false;

function ytCmd(func) {
    ytPlayer.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: func, args: [] }),
        '*'
    );
}

function loadPlayer() {
    if (loaded) return;
    loaded = true;
    ytPlayer.src = 'https://www.youtube.com/embed/' + YT_VIDEO_ID
        + '?autoplay=1&loop=1&playlist=' + YT_VIDEO_ID
        + '&controls=0&enablejsapi=1&origin=' + location.origin;
}

function setPlaying(state) {
    playing = state;
    musicBtn.classList.toggle('off', !state);
    iconPlay.style.display  = state ? 'none' : '';
    iconPause.style.display = state ? '' : 'none';
}

/* ═══ ЗАСТАВКА ═══ */
var intro    = document.getElementById('intro');
var introBtn = document.getElementById('introBtn');

introBtn.addEventListener('click', function () {
    /* Запустить музыку — это явный клик пользователя, браузер разрешит */
    loadPlayer();
    setPlaying(true);

    /* Скрыть заставку */
    intro.classList.add('hide');
    setTimeout(function () { intro.style.display = 'none'; }, 950);
});

/* ═══ КНОПКА МУЗЫКИ (пауза/возобновление) ═══ */
musicBtn.addEventListener('click', function () {
    if (playing) {
        ytCmd('pauseVideo');
        setPlaying(false);
    } else {
        if (!loaded) loadPlayer();
        else ytCmd('playVideo');
        setPlaying(true);
    }
});
