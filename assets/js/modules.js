// Configurazione Firebase (uguale a home.js)
const firebaseConfig = { ... }; // Usa la stessa configurazione

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elementi UI
const userEmailElement = document.getElementById('userEmail');
const logoutBtn = document.querySelector('.btn-logout');
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const accessForm = document.getElementById('accessForm');
const clearSignature = document.getElementById('clearSignature');
const announcementBanner = document.getElementById('announcementBanner');
const closeAnnouncement = document.getElementById('closeAnnouncement');

// Signature Pad
const canvas = document.getElementById('signaturePad');
const signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255, 255, 255)'
});

// Gestione UI
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
  dropdownMenu.classList.remove('show');
});

logoutBtn.addEventListener('click', () => {
  firebase.auth().signOut();
});

clearSignature.addEventListener('click', () => {
  signaturePad.clear();
});

closeAnnouncement.addEventListener('click', () => {
  announcementBanner.style.display = 'none';
});

// Invia modulo
accessForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if(signaturePad.isEmpty()) {
    alert('Per favore apponi la firma');
    return;
  }

  const formData = {
    id: accessForm.querySelector('input:nth-of-type(1)').value,
    nome: accessForm.querySelector('input:nth-of-type(2)').value,
    varco: accessForm.querySelector('select:nth-of-type(1)').value,
    orarioInizio: accessForm.querySelector('input[type="time"]:nth-of-type(1)').value,
    orarioFine: accessForm.querySelector('input[type="time"]:nth-of-type(2)').value,
    tipologia: accessForm.querySelector('select:nth-of-type(2)').value,
    note: accessForm.querySelector('textarea').value,
    signature: signaturePad.toDataURL(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    userEmail: firebase.auth().currentUser.email
  };

  try {
    await db.collection('accessLogs').add(formData);
    alert('Modulo inviato con successo!');
    accessForm.reset();
    signaturePad.clear();
  } catch (error) {
    alert('Errore: ' + error.message);
  }
});

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
      }
    });
}

// Init
firebase.auth().onAuthStateChanged(user => {
  if(!user) {
    window.location.href = 'index.html';
  } else {
    userEmailElement.textContent = user.email;
    loadAnnouncement();
  }
});
