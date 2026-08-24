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
        if (sceneNumber === 5) checkRsvpStatus();
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

// ----------------- RSVP -----------------
function checkRsvpStatus() {
    const form = document.getElementById('rsvp-form');
    const success = document.getElementById('rsvp-success');
    if (localStorage.getItem("rsvp_submitted") === "true") {
        form.classList.add('hidden');
        success.classList.remove('hidden');
        success.querySelector('h3').textContent = 'Вы уже ответили!';
        success.querySelector('p').textContent = 'Рады видеть вас на нашем празднике.';
    }
}

function sendRsvp(event) {
    event.preventDefault();
    const form = document.getElementById('rsvp-form');
    const success = document.getElementById('rsvp-success');
    const submitButton = form.querySelector('.btn-submit');

    if (localStorage.getItem("rsvp_submitted") === "true") {
        alert("Вы уже отправляли ответ с этого устройства.");
        return;
    }

    if (submitButton) submitButton.disabled = true;

    const formData = new FormData(form);
    formData.append("access_key", "e7d0e149-5d47-4ca0-b82c-73d5806cbdd1"); // ваш ключ
    formData.append("subject", "Новый ответ RSVP на свадьбу Максима и Дианы!");

    const drinks = [];
    form.querySelectorAll('input[name="drinks"]:checked').forEach((checkbox) => {
        drinks.push(checkbox.value);
    });
    formData.append("Выбранные напитки", drinks.length > 0 ? drinks.join(', ') : 'Не выбрано');

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(async (response) => {
        if (response.status === 200) {
            localStorage.setItem("rsvp_submitted", "true");
            form.classList.add('hidden');
            success.classList.remove('hidden');
            success.querySelector('h3').textContent = 'Спасибо за ваш ответ!';
            success.querySelector('p').textContent = 'Ваши данные успешно переданы.';
        } else {
            let json = await response.json();
            alert("Ошибка: " + json.message);
            if (submitButton) submitButton.disabled = false;
        }
    })
    .catch(() => {
        alert("Что-то пошло не так. Проверьте подключение к интернету.");
        if (submitButton) submitButton.disabled = false;
    });
}

// ----------------- ТАЙМЕР -----------------
function initTimer() {
    const weddingDate = new Date("September 12, 2026 17:00:00").getTime();
    const timerInterval = setInterval(updateTimer, 1000);

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
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    document.getElementById('scene-1').classList.add('active');
    // Сбросить RSVP (если нужно) – закомментируйте, если не требуется
    // localStorage.removeItem("rsvp_submitted");
}

// Инициализация
document.addEventListener("DOMContentLoaded", function() {
    initTimer();
    checkRsvpStatus();
    resetStory(); // подготавливаем слайды
});
