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
const db = firebase.firestore();

// Elementi UI
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');
const dropdownName = document.getElementById('dropdownName');
const dropdownEmail = document.getElementById('dropdownEmail');
const logoutBtn = document.querySelector('.btn-logout');
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const servicesGrid = document.getElementById('servicesGrid');
const announcementBanner = document.getElementById('announcementBanner');
const announcementTitle = document.getElementById('announcementTitle');
const announcementText = document.getElementById('announcementText');
const closeAnnouncement = document.getElementById('closeAnnouncement');

// Lista amministratori
const ADMIN_EMAILS = [
  "jacopo@ferrioli.eu",
  "postmaster@ferrioli.eu",
  "amministrazione.generale@cas.ferrioli.eu"
];

// Formatta il nome utente dalla email
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
  
  // Sostituisci i punti con spazi e formatta
  const nameParts = usernamePart.split('.');
  const formattedName = nameParts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
  
  return formattedName;
}

// Carica i servizi in base all'email
function renderServices(email) {
  servicesGrid.innerHTML = '';
  
  const isAdmin = ADMIN_EMAILS.includes(email);
  const isFerrioli = email.endsWith('@ferrioli.eu');
  const isSubdomain = email.endsWith('.ferrioli.eu');

  // WEBMAIL (sempre per primi)
  if (isFerrioli) {
    addServiceCard('Webmail Aruba', 'https://webmail.aruba.it');
  } else if (isSubdomain) {
    addServiceCard('Webmail Zoho', 'https://mail.zoho.com');
  }

  // WEBMAIL EXTRA PER ADMIN
  if (isAdmin) {
    if (isFerrioli) {
      addServiceCard('Webmail Zoho (Admin)', 'https://mail.zoho.com');
    } else if (isSubdomain) {
      addServiceCard('Webmail Aruba (Admin)', 'https://webmail.aruba.it');
    }
  }

  // SERVIZI STANDARD
  addServiceCard('Billetto', 'https://billetto.it');
  addServiceCard('BaseBear', 'https://basebear.com');
  addServiceCard('Notion', 'https://notion.so');
}

// Aggiungi una card servizio
function addServiceCard(title, url) {
  const card = document.createElement('div');
  card.className = 'service-card';
  card.innerHTML = `
    <h3>${title}</h3>
    <a href="${url}" target="_blank" class="btn">Accedi</a>
  `;
  servicesGrid.appendChild(card);
}

// Carica l'annuncio più recente
function loadAnnouncement() {
  db.collection('announcements')
    .orderBy('date', 'desc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      if (!querySnapshot.empty) {
        const announcement = querySnapshot.docs[0].data();
        announcementTitle.textContent = announcement.title + ': ';
        announcementText.textContent = announcement.text;
      } else {
        announcementBanner.style.display = 'none';
      }
    })
    .catch(error => {
      console.error("Errore caricamento annunci:", error);
      announcementBanner.style.display = 'none';
    });
}

// Gestione eventi
function setupEventListeners() {
  // Menu principale
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  // Profilo utente
  userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => window.location.href = 'index.html')
      .catch(error => console.error("Logout error:", error));
  });

  // Chiudi annuncio
  closeAnnouncement.addEventListener('click', () => {
    announcementBanner.style.display = 'none';
  });

  // Chiudi menu cliccando altrove
  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    userDropdown.classList.remove('show');
  });
}

// Inizializzazione
function init() {
  setupEventListeners();

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    // Formatta e mostra il nome utente
    const displayName = formatDisplayName(user.email);
    userProfile.textContent = displayName;
    dropdownName.textContent = displayName;
    dropdownEmail.textContent = user.email;

    // Carica contenuti
    renderServices(user.email);
    loadAnnouncement();

    // Aggiungi link admin se autorizzato
    if (ADMIN_EMAILS.includes(user.email)) {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = 'Admin';
      dropdownMenu.appendChild(adminLink);
    }
  });
}

// Avvia l'applicazione
init();
