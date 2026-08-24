// Основная функция переключения сцен
function nextScene(sceneNumber) {
    // Включение музыки при первом взаимодействии
    const music = document.getElementById('bg-music');
    if (music && music.paused) {
        music.play().catch(() => console.log("Музыка активирована"));
    }

    // Скрытие текущей сцены
    const currentScene = document.querySelector('.scene.active');
    if (currentScene) {
        currentScene.classList.remove('active');
    }

    // Активация новой сцены
    const nextSceneElement = document.getElementById(`scene-${sceneNumber}`);
    if (nextSceneElement) {
        nextSceneElement.classList.add('active');
        // Особые действия при активации
        if (sceneNumber === 2) resetStory();
        if (sceneNumber === 5) initTimer(); // таймер запускается при переходе
    }
}

// ----------------- СЛАЙДЫ ИСТОРИИ -----------------
let currentSlide = 0;
const slides = document.querySelectorAll('.story-slide');
const dotsContainer = document.querySelector('.story-dots');

// Создаём точки
slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeStory(direction) {
    goToSlide((currentSlide + direction + slides.length) % slides.length);
}

// Сброс слайдов при входе на сцену 2
function resetStory() {
    goToSlide(0);
}

// ----------------- ГАЛЕРЕЯ (проявление фото) -----------------
function revealPhoto(item) {
    item.classList.add('revealed');
}

// ----------------- ТАЙМЕР -----------------
let timerInterval = null;

function initTimer() {
    if (timerInterval) clearInterval(timerInterval); // очищаем предыдущий, если есть
    const weddingDate = new Date("September 12, 2026 17:00:00").getTime();
    timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            const timerContainer = document.querySelector('.wedding-timer');
            if (timerContainer) {
                timerContainer.innerHTML = "<div class='timer-number' style='font-size: 1.5rem;'>Этот счастливый день настал! 🥂</div>";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("timer-days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("timer-hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("timer-minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("timer-seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }
}

// ----------------- ПЕРЕЗАПУСК -----------------
function restart() {
    // Останавливаем таймер
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    // Сбрасываем сцены
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    document.getElementById('scene-1').classList.add('active');

    // Сбрасываем слайды
    resetStory();
}

// Инициализация (выполняется при загрузке)
document.addEventListener("DOMContentLoaded", function() {
    // Ничего не запускаем до первого взаимодействия, кроме подготовки слайдов
    resetStory(); // подготовка точек
});
