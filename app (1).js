auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
    listenForMessages();
  } else {
    document.getElementById('login').style.display = 'block';
    document.getElementById('chat').style.display = 'none';
  }
});

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password).catch(alert);
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password).catch(alert);
}

function logout() {
  auth.signOut();
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  const user = auth.currentUser;
  if (message && user) {
    db.collection("messages").add({
      text: message,
      user: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = '';
  }
}

function listenForMessages() {
  db.collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const msgEl = document.createElement("div");
        msgEl.textContent = `${msg.user}: ${msg.text}`;
        messagesDiv.appendChild(msgEl);
      });
    });
}
