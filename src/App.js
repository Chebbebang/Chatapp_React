import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAso_m3jFdOIplQRaBvGQe-ulYQ-vzT-yE",
  authDomain: "chatapp-v2-4922a.firebaseapp.com",
  projectId: "chatapp-v2-4922a",
  storageBucket: "chatapp-v2-4922a.appspot.com",
  messagingSenderId: "1029270895469",
  appId: "1:1029270895469:web:c88d32d0f0c85cbf217864",
  measurementId: "G-M19K4R014H"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);  

  return (
    <div className="App">

      <header>
        <h1>#Chebb_CHATROOM</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function ChatRoom() {

  const SmoothScroll = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {

    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
        text: formValue,
        createdAt : firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
    });

    setFormValue('');

    SmoothScroll.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={SmoothScroll}>

        </div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message..." />

        <button type="submit" >Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {

  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="Profile" />
      <p>{text}</p>
    </div>
  )
}

function SignIn() {
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={useSignInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

export default App;
