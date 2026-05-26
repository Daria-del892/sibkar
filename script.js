/* ==========================================
   МОБИЛЬНОЕ МЕНЮ
   ========================================== */

// Функция для открытия/закрытия мобильного меню
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    // Переключаем класс 'active', который показывает меню
    menu.classList.toggle('active');
    
    // Блокируем прокрутку основного фона, когда меню открыто
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

// Функция для принудительного закрытия меню (при клике на ссылку)
function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.remove('active');
    // Возвращаем прокрутку
    document.body.style.overflow = '';
}

/* ==========================================
   ПОИСК ПО САЙТУ
   ========================================== */

// База данных ключевых слов для каждого раздела сайта
const sectionKeywords = {
    'home': 'главная страница начало',
    'services': 'услуги ремонт диагностика ТО замена масло двигатель подвеска электрика кузов',
    'masters': 'мастера специалисты команда механики электрики',
    'about': 'о компании о нас преимущества гарантия',
    'brands': 'бренды марки автомобили Toyota BMW Mercedes Kia Hyundai',
    'blog': 'блог статьи советы автовладельцам',
    'contacts': 'контакты адрес телефон карта схема проезда запись форма'
};

// Открытие модального окна поиска
function openSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('active');
    // Автоматически ставим фокус в поле ввода
    document.getElementById('searchInput').focus();
    // Блокируем прокрутку фона
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна поиска
function closeSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Очищаем поле ввода и результаты
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// Логика поиска при вводе текста
function searchSite() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    // Ищем только если введено более 2 символов
    if (query.length < 2) { 
        resultsContainer.innerHTML = ''; 
        return; 
    }
    
    const results = [];
    
    // 1. Поиск по основным разделам
    Object.keys(sectionKeywords).forEach(sectionId => {
        const keywords = sectionKeywords[sectionId];
        const section = document.getElementById(sectionId);
        const title = section ? section.querySelector('h2')?.textContent || sectionId : sectionId;
        
        // Проверяем, содержится ли запрос в ключевых словах или заголовке
        if (keywords.includes(query) || title.toLowerCase().includes(query)) {
            results.push({ 
                id: sectionId, 
                title: title.replace('\n', '').trim(), 
                description: `Перейти к разделу: ${title}` 
            });
        }
    });

    // 2. Поиск по карточкам услуг и статьям (элементы с атрибутом data-keywords)
    document.querySelectorAll('[data-keywords]').forEach(el => {
        const keywords = el.getAttribute('data-keywords').toLowerCase();
        const title = el.querySelector('h3')?.textContent || '';
        
        if (keywords.includes(query) || title.toLowerCase().includes(query)) {
            const section = el.closest('section');
            results.push({ 
                id: section?.id || '', 
                title: title, 
                description: 'Услуга или информация' 
            });
        }
    });
    
    // Вывод результатов
    if (results.length > 0) {
        resultsContainer.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="goToSection('${r.id}')">
                <h4>${r.title}</h4>
                <p>${r.description}</p>
            </div>`).join('');
    } else {
        resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Ничего не найдено</div>';
    }
}

// Переход к найденному разделу
function goToSection(sectionId) { 
    closeSearch(); 
    const section = document.getElementById(sectionId); 
    if (section) section.scrollIntoView({ behavior: 'smooth' }); 
}

// Закрытие поиска и меню по клавише Escape
document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape') { 
        closeSearch(); 
        closeMenu(); 
    } 
});

// Закрытие поиска при клике на затемненный фон
document.getElementById('searchModal').addEventListener('click', (e) => { 
    if (e.target.id === 'searchModal') closeSearch(); 
});


/* ==========================================
   ВСПЛЫВАЮЩЕЕ ОКНО АКЦИИ (PROMO POPUP)
   ========================================== */

function showPromo() {
    // Проверяем, показывали ли мы уже это окно (чтобы не надоедать)
    if (!localStorage.getItem('promoShown')) {
        // Показываем через 3 секунды после загрузки
        setTimeout(() => {
            document.getElementById('promoOverlay').classList.add('active');
            document.getElementById('promoPopup').classList.add('active');
            document.body.style.overflow = 'hidden';
            startPromoTimer();
        }, 3000);
    }
}

function closePromo() {
    document.getElementById('promoOverlay').classList.remove('active');
    document.getElementById('promoPopup').classList.remove('active');
    document.body.style.overflow = '';
    // Запоминаем, что пользователь закрыл окно
    localStorage.setItem('promoShown', 'true');
}

// Таймер обратного отсчета
function startPromoTimer() {
    // Устанавливаем время (2 дня, 18 часов, 45 минут)
    let time = 2 * 24 * 60 * 60 + 18 * 60 * 60 + 45 * 60;
    
    const update = () => {
        if (time <= 0) return;
        
        const d = Math.floor(time / 86400);
        const h = Math.floor((time % 86400) / 3600);
        const m = Math.floor((time % 3600) / 60);
        
        // Обновляем текст в HTML
        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        
        time--;
        setTimeout(update, 1000);
    };
    update();
}


/* ==========================================
   УВЕДОМЛЕНИЯ (TOAST NOTIFICATIONS)
   ========================================== */

function showToast(message, type = 'success', title = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Иконки для разных типов уведомлений
    const icons = { 
        success: '✅', 
        error: '❌', 
        warning: '⚠️', 
        info: 'ℹ' 
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <div class="toast-content">
            ${title ? `<strong>${title}</strong>` : ''}
            <small>${message}</small>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => toast.remove(), 5000);
}


/* ==========================================
   КНОПКА "НАВЕРХ" (SCROLL TO TOP)
   ========================================== */

function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

// Показываем кнопку, когда прокрутили вниз больше чем на 400px
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (window.scrollY > 400) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});


/* ==========================================
   ОТПРАВКА ФОРМЫ (ИМИТАЦИЯ)
   ========================================== */

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Имитация загрузки
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Имитация задержки (как будто данные уходят на сервер)
    setTimeout(() => {
        showToast('Заявка отправлена!', 'success', '✅ Успешно');
        showToast('Мы перезвоним в течение 15 минут', 'info');
        
        e.target.reset(); // Очищаем поля формы
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});


/* ==========================================
   ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
   ========================================== */

window.addEventListener('load', () => {
    showPromo(); // Запускаем проверку промо-окна
    setTimeout(() => showToast('Добро пожаловать в СИБКАР! ', 'info'), 5000); // Приветствие через 5 сек
});

// Закрываем мобильное меню, если пользователь повернул телефон в горизонтальный режим
window.addEventListener('resize', () => { 
    if (window.innerWidth > 768) closeMenu(); 
});