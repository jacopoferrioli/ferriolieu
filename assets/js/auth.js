// Configurazione Firebase con le tue API
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

// Lista amministratori
const ADMIN_EMAILS = [
    "jacopo@ferrioli.eu",
    "postmaster@ferrioli.eu",
    "amministrazione.generale@cas.ferrioli.eu"
];

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Verifica dominio email
    if(!email.endsWith('@ferrioli.eu') && !email.endsWith('.ferrioli.eu')) {
        alert('Accesso consentito solo a domini ferrioli.eu');
        return;
    }
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'home.html';
        })
        .catch(error => {
            alert('Errore: ' + error.message);
        });
});

document.getElementById('forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    if(!email) {
        alert('Inserisci la tua email per recuperare la password');
        return;
    }
    
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('Email di recupero inviata!');
        })
        .catch(error => {
            alert('Errore: ' + error.message);
        });
});

// Verifica se già loggato
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        window.location.href = 'home.html';
    }
});
