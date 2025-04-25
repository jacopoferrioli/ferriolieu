// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDitA_4JDkUTJvX7zrfsLgSCDhhWLgP9Cs",
    authDomain: "ferriolieu.firebaseapp.com",
    projectId: "ferriolieu",
    storageBucket: "ferriolieu.appspot.com",
    messagingSenderId: "373796791074",
    appId: "1:373796791074:web:7ed13883e89fcff932fb7b"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Elementi UI
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');
const servicesGrid = document.getElementById('servicesGrid');

// Lista amministratori
const ADMIN_EMAILS = [
    "jacopo@ferrioli.eu",
    "postmaster@ferrioli.eu",
    "amministrazione.generale@cas.ferrioli.eu"
];

// Formatta il nome utente
function formatDisplayName(email) {
    if (!email) return '';
    
    // Casi speciali
    if (email === 'jacopo@ferrioli.eu') return 'Jacopo Ferrioli | 05149142';
    if (email === 'amministrazione.generale@cas.ferrioli.eu') return 'Amministrazione Generale';
    
    // Formattazione standard
    const username = email.split('@')[0];
    return username.split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

// Carica i servizi
function loadServices(email) {
    servicesGrid.innerHTML = '';
    
    const isAdmin = ADMIN_EMAILS.includes(email);
    const isFerrioli = email.endsWith('@ferrioli.eu');
    const isSubdomain = email.endsWith('.ferrioli.eu');

    // WEBMAIL
    if (isFerrioli) addServiceCard('Webmail Aruba', 'https://webmail.aruba.it');
    if (isSubdomain) addServiceCard('Webmail Zoho', 'https://mail.zoho.com');
    
    // Extra per admin
    if (isAdmin) {
        if (isFerrioli) addServiceCard('Webmail Zoho (Admin)', 'https://mail.zoho.com');
        if (isSubdomain) addServiceCard('Webmail Aruba (Admin)', 'https://webmail.aruba.it');
    }

    // Servizi standard
    addServiceCard('Billetto', 'https://billetto.it');
    addServiceCard('BaseBear', 'https://basebear.com');
    addServiceCard('Notion', 'https://notion.so');
}

function addServiceCard(title, url) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <h3>${title}</h3>
        <a href="${url}" target="_blank" class="btn">Accedi</a>
    `;
    servicesGrid.appendChild(card);
}

// Gestione UI
function setupUI(user) {
    // Formatta e mostra il nome utente
    const displayName = formatDisplayName(user.email);
    userProfile.innerHTML = displayName;
    document.getElementById('dropdownName').textContent = displayName;
    document.getElementById('dropdownEmail').textContent = user.email;
    
    // Carica servizi
    loadServices(user.email);
}

// Event Listeners
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
    userDropdown.classList.remove('show');
});

document.querySelector('.btn-logout').addEventListener('click', () => {
    firebase.auth().signOut();
});

// Init
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        setupUI(user);
    } else {
        window.location.href = 'index.html';
    }
});
