// Funzione per formattare il nome utente
function formatDisplayName(email) {
    if (!email) return '';
    
    // Casi speciali
    if (email === 'jacopo@ferrioli.eu') {
        return 'Jacopo Ferrioli | 05149142';
    }
    
    if (email === 'amministrazione.generale@cas.ferrioli.eu') {
        return 'Amministrazione Generale';
    }
    
    // Estrai la parte prima della @
    const usernamePart = email.split('@')[0];
    
    // Sostituisci punti e trattini con spazi
    const formatted = usernamePart.replace(/[.-]/g, ' ')
                                 .split(' ')
                                 .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                 .join(' ');
    
    return formatted;
}

// Gestione dropdown utente
function setupUserDropdown() {
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    
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
}
// Configurazione Firebase (stessa di auth.js)
const firebaseConfig = {
    apiKey: "AIzaSyDitA_4JDkUTJvX7zrfsLgSCDhhWLgP9Cs",
    authDomain: "ferriolieu.firebaseapp.com",
    projectId: "ferriolieu",
    storageBucket: "ferriolieu.appspot.com",
    messagingSenderId: "373796791074",
    appId: "1:373796791074:web:7ed13883e89fcff932fb7b"
};

firebase.initializeApp(firebaseConfig);

const ADMIN_EMAILS = [
    "jacopo@ferrioli.eu",
    "postmaster@ferrioli.eu",
    "amministrazione.generale@cas.ferrioli.eu"
];

document.addEventListener('DOMContentLoaded', () => {
    const userEmailElement = document.getElementById('userEmail');
    const servicesGrid = document.getElementById('servicesGrid');
    const logoutBtn = document.querySelector('.btn-logout');
    
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Formatta e mostra il nome utente
        const displayName = formatDisplayName(user.email);
        document.getElementById('userProfile').textContent = displayName;
        document.getElementById('dropdownName').textContent = displayName;
        document.getElementById('dropdownEmail').textContent = user.email;
        
        // Il resto del tuo codice esistente...
        userEmailElement.textContent = user.email;
        loadServices(user.email);
        
    } else {
        window.location.href = 'index.html';
    }
});

// Inizializza il dropdown
setupUserDropdown();
    
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });
    
    function renderServices(email) {
        servicesGrid.innerHTML = '';
        
        // Pulsanti per tutti
        addServiceCard('Billetto', 'Accedi a Billetto', 'https://billetto.it');
        addServiceCard('BaseBear', 'Accedi a BaseBear', 'https://basebear.com');
        addServiceCard('Notion', 'Accedi a Notion', 'https://notion.so');
        
        // Pulsanti specifici
        if(email.endsWith('@ferrioli.eu')) {
            addServiceCard('Webmail Aruba', 'Webmail Aruba', 'https://webmail.aruba.it');
        } else if(email.endsWith('.ferrioli.eu')) {
            addServiceCard('Webmail Zoho', 'Webmail Zoho', 'https://mail.zoho.com');
        }
        
        // Pulsanti admin
        if(ADMIN_EMAILS.includes(email)) {
            addServiceCard('Admin Panel', 'Pannello di controllo', '#');
        }
    }
    
    function addServiceCard(title, description, link) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <a href="${link}" target="_blank" class="btn btn-primary">Accedi</a>
        `;
        servicesGrid.appendChild(card);
    }
});
