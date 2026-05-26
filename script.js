/* ==========================================
   МОБИЛЬНОЕ МЕНЮ
   ========================================== */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}
function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================
   ПОИСК ПО САЙТУ
   ========================================== */
const sectionKeywords = {
    'home': 'главная страница начало',
    'services': 'услуги ремонт диагностика ТО замена масло двигатель подвеска электрика кузов',
    'masters': 'мастера специалисты команда механики электрики',
    'about': 'о компании о нас преимущества гарантия',
    'brands': 'бренды марки автомобили Toyota BMW Mercedes Kia Hyundai',
    'blog': 'блог статьи советы автовладельцам',
    'contacts': 'контакты адрес телефон карта схема проезда запись форма'
};

function openSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('active');
    document.getElementById('searchInput').focus();
    document.body.style.overflow = 'hidden';
}
function closeSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function searchSite() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    if (query.length < 2) { resultsContainer.innerHTML = ''; return; }
    
    const results = [];
    Object.keys(sectionKeywords).forEach(sectionId => {
        const keywords = sectionKeywords[sectionId];
        const section = document.getElementById(sectionId);
        const title = section ? section.querySelector('h2')?.textContent || sectionId : sectionId;
        if (keywords.includes(query) || title.toLowerCase().includes(query)) {
            results.push({ id: sectionId, title: title.replace('\n', '').trim(), description: `Перейти к разделу: ${title}` });
        }
    });

    document.querySelectorAll('[data-keywords]').forEach(el => {
        const keywords = el.getAttribute('data-keywords').toLowerCase();
        const title = el.querySelector('h3')?.textContent || '';
        if (keywords.includes(query) || title.toLowerCase().includes(query)) {
            const section = el.closest('section');
            results.push({ id: section?.id || '', title: title, description: 'Услуга или информация' });
        }
    });

    if (results.length > 0) {
        resultsContainer.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="goToSection('${r.id}')">
                <h4>${r.title}</h4><p>${r.description}</p>
            </div>`).join('');
    } else {
        resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Ничего не найдено</div>';
    }
}

function goToSection(sectionId) { 
    closeSearch(); 
    const section = document.getElementById(sectionId); 
    if (section) section.scrollIntoView({ behavior: 'smooth' }); 
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSearch(); closeMenu(); } });
document.getElementById('searchModal').addEventListener('click', (e) => { if (e.target.id === 'searchModal') closeSearch(); });

/* ==========================================
   ВСПЛЫВАЮЩЕЕ ОКНО АКЦИИ
   ========================================== */
function showPromo() {
    if (!localStorage.getItem('promoShown')) {
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
    localStorage.setItem('promoShown', 'true');
}
function startPromoTimer() {
    let time = 2 * 24 * 60 * 60 + 18 * 60 * 60 + 45 * 60;
    const update = () => {
        if (time <= 0) return;
        const d = Math.floor(time / 86400), h = Math.floor((time % 86400) / 3600), m = Math.floor((time % 3600) / 60);
        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        time--;
        setTimeout(update, 1000);
    };
    update();
}

/* ==========================================
   УВЕДОМЛЕНИЯ И КНОПКА "НАВЕРХ"
   ========================================== */
function showToast(message, type = 'success', title = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ' };
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <div class="toast-content">
            ${title ? `<strong>${title}</strong>` : ''}
            <small>${message}</small>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
});

/* ==========================================
   ФОРМА И ИНИЦИАЛИЗАЦИЯ
   ========================================== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    setTimeout(() => {
        showToast('Заявка отправлена!', 'success', '✅ Успешно');
        showToast('Мы перезвоним в течение 15 минут', 'info');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

window.addEventListener('load', () => {
    showPromo();
    setTimeout(() => showToast('Добро пожаловать в СИБКАР! ', 'info'), 5000);
});
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });