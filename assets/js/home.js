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
const userEmailElement = document.getElementById('userEmail');
const servicesGrid = document.getElementById('servicesGrid');
const logoutBtn = document.querySelector('.btn-logout');
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const announcementBanner = document.getElementById('announcementBanner');
const closeAnnouncement = document.getElementById('closeAnnouncement');

// Lista amministratori
const ADMIN_EMAILS = [
  "jacopo@ferrioli.eu",
  "postmaster@ferrioli.eu", 
  "amministrazione.generale@cas.ferrioli.eu"
];

// Menu a tendina
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
  dropdownMenu.classList.remove('show');
});

// Logout
logoutBtn.addEventListener('click', () => {
  firebase.auth().signOut();
});

// Chiudi banner
closeAnnouncement.addEventListener('click', () => {
  announcementBanner.style.display = 'none';
});

// Carica servizi
function renderServices(email) {
  servicesGrid.innerHTML = '';
  
  const isAdmin = ADMIN_EMAILS.includes(email);
  const isFerrioli = email.endsWith('@ferrioli.eu');
  const isSubdomain = email.endsWith('.ferrioli.eu');

  // WEBMAIL
  if(isFerrioli) addServiceCard('Webmail Aruba', 'https://webmail.aruba.it');
  if(isSubdomain) addServiceCard('Webmail Zoho', 'https://mail.zoho.com');
  
  // Extra per admin
  if(isAdmin) {
    if(isFerrioli) addServiceCard('Webmail Zoho (Admin)', 'https://mail.zoho.com');
    if(isSubdomain) addServiceCard('Webmail Aruba (Admin)', 'https://webmail.aruba.it');
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

// Carica annunci
function loadAnnouncement() {
  db.collection('announcements')
    .orderBy('date', 'desc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      if(!querySnapshot.empty) {
        const announcement = querySnapshot.docs[0].data();
        document.getElementById('announcementTitle').textContent = announcement.title;
        document.getElementById('announcementText').textContent = announcement.text;
      } else {
        announcementBanner.style.display = 'none';
      }
    });
}

// Init
firebase.auth().onAuthStateChanged(user => {
  if(!user) {
    window.location.href = 'index.html';
  } else {
    userEmailElement.textContent = user.email;
    renderServices(user.email);
    loadAnnouncement();
    
    // Mostra link admin se autorizzato
    if(ADMIN_EMAILS.includes(user.email)) {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.className = 'admin-link';
      adminLink.textContent = 'Admin';
      document.querySelector('.dropdown-menu').appendChild(adminLink);
    }
  }
});
