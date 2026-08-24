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
        // Особые действия при активации некоторых сцен
        if (sceneNumber === 5) checkRsvpStatusOnScene5();
        if (sceneNumber === 4) scrollAnimation();
        if (sceneNumber === 2) initStorySlides();
    }
}

// ----------------- СЦЕНА 2: СЛАЙДЫ ИСТОРИИ -----------------
let currentStoryIndex = 0;
const storySlides = document.querySelectorAll('.story-slide');
const dots = document.querySelectorAll('.dot');

function changeStory(direction) {
    storySlides[currentStoryIndex].classList.remove('active');
    dots[currentStoryIndex].classList.remove('active');
    currentStoryIndex = (currentStoryIndex + direction + storySlides.length) % storySlides.length;
    storySlides[currentStoryIndex].classList.add('active');
    dots[currentStoryIndex].classList.add('active');
}

function initStorySlides() {
    // Сброс на первый слайд при каждом входе
    currentStoryIndex = 0;
    storySlides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === 0);
    });
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === 0);
    });
}

// Клик по точкам
dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        storySlides[currentStoryIndex].classList.remove('active');
        dots[currentStoryIndex].classList.remove('active');
        currentStoryIndex = idx;
        storySlides[idx].classList.add('active');
        dots[idx].classList.add('active');
    });
});

// ----------------- СЦЕНА 3: ПРОЯВЛЕНИЕ ФОТО -----------------
function revealPhoto(item) {
    item.classList.add('revealed');
    // Можно добавить анимацию для соседних фото (их размытие уменьшается)
}

// ----------------- СЦЕНА 4: СВИТОК (анимация появления текста) -----------------
function scrollAnimation() {
    const paper = document.getElementById('scrollPaper');
    paper.classList.add('active');
    // Активация класса .active у контейнера сцены уже происходит через .scene.active,
    // поэтому стили .scroll-container.active .scroll-inner сработают автоматически.
}

// ----------------- СЦЕНА 5: RSVP -----------------
function checkRsvpStatusOnScene5() {
    const form = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('rsvp-success');
    if (localStorage.getItem("rsvp_submitted") === "true") {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        const successTitle = successMessage.querySelector('h3');
        const successDesc = document.getElementById('success-desc');
        if (successTitle) successTitle.textContent = 'Вы уже оставили свой ответ!';
        if (successDesc) successDesc.textContent = 'Рады, что вы будете с нами в этот важный день.';
    }
}

function sendRsvp(event) {
    event.preventDefault();
    const form = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('rsvp-success');
    const submitButton = form.querySelector('.btn-rsvp-submit');

    if (localStorage.getItem("rsvp_submitted") === "true") {
        alert("Вы уже отправляли ответ с этого устройства.");
        return;
    }

    if (submitButton) submitButton.disabled = true;

    const formData = new FormData(form);
    formData.append("access_key", "e7d0e149-5d47-4ca0-b82c-73d5806cbdd1");
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
            form.style.display = 'none';
            successMessage.style.display = 'block';
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

// ----------------- СЦЕНА 6: ТАЙМЕР -----------------
function initWeddingTimer() {
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
    // Сброс всех сцен и показ первой
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    document.getElementById('scene-1').classList.add('active');
    // Если нужно сбросить RSVP, раскомментируйте:
    // localStorage.removeItem("rsvp_submitted");
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function() {
    initWeddingTimer();
    checkRsvpStatusOnScene5();
    initStorySlides(); // подготовка слайдов
});
