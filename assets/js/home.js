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
    
    firebase.auth().onAuthStateChanged(user => {
        if(!user) {
            window.location.href = 'index.html';
        } else {
            userEmailElement.textContent = user.email;
            renderServices(user.email);
        }
    });
    
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });
    
    function renderServices(email) {
        servicesGrid.innerHTML = '';
        
        // Pulsanti per tutti
        addServiceCard('Billetto', 'Accedi a Billetto', 'https://billetto.it/organiser/sign_in?return_to=%2Forganiser');
        addServiceCard('BaseBear', 'Accedi a BaseBear', 'https://basebear.com/login.aspx?a=638116be-1ad6-41d1-9303-73ce88794aa6');
        addServiceCard('Notion', 'Accedi a Notion', 'https://notion.so');
        
        // Pulsanti specifici
        if(email.endsWith('@ferrioli.eu')) {
            addServiceCard('Webmail Aruba', 'Webmail Aruba', 'https://webmail.aruba.it');
        } else if(email.endsWith('.ferrioli.eu')) {
            addServiceCard('Webmail Zoho', 'Webmail Zoho', 'https://www.zoho.com/mail/login.html');
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
