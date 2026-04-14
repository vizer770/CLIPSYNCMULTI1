
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    auth.signInWithEmailAndPassword(email, pass).then((userCredential) => {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('syncSection').style.display = 'block';
        startSync(userCredential.user.uid);
    }).catch(err => alert("Login Error: " + err.message));
}

function startSync(uid) {
    // Listen for Phone updates
    db.collection("users").doc(uid).onSnapshot((doc) => {
        if (doc.exists) {
            const text = doc.data().clipboard;
            document.getElementById('syncWindow').innerText = text;
        }
    });
}

function sendToPhone() {
    const text = document.getElementById('webInput').value;
    const uid = auth.currentUser.uid;
    if (!text) return;

    db.collection("users").doc(uid).set({
        clipboard: text,
        timestamp: Date.now()
    }).then(() => {
        document.getElementById('webInput').value = ""; // Clear input
    });
}
