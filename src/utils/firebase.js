import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, update, query, orderByChild, onValue, off, equalTo, serverTimestamp, remove, get, child } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firebaseConfig } from "./firebase.cfg";

// firebase.cfg content:
//
// export const firebaseConfig = {
//   apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   authDomain: "clipboardnet.firebaseapp.com",
//   databaseURL: "https://DBDBDBD.firebasedatabase.app",
//   projectId: "clipboardnet",
//   storageBucket: "clipboardnet.appspot.com",
//   messagingSenderId: "1234567890",
//   appId: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

export async function signIn() {
  await signInAnonymously(auth);
  return auth.currentUser.uid;
}

function generateKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ1234567890"; //1=I, 0=D=Q=O, 2=Z, 8=B, 5=S, V=W, 6=G
  let key = "";
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(chars.length * Math.random()));
  }
  return key;
}

export async function addClip(text) {
  const key = generateKey();
  let clip = {};
  clip.createdBy = auth.currentUser.uid;
  clip.text = text;
  clip.updatedOn = clip.createdOn = serverTimestamp();
  await set(ref(db, 'clips/' + key), clip);
  return key;
}

export async function updateClip(key, text) {
  let clip = {};
  clip.text = text;
  clip.updatedOn = serverTimestamp();
  await update(ref(db, 'clips/' + key), clip);
}

export async function updateUser(subs) {
  const newSubscriptions = subs.join(" ");
  await set(ref(db, `users/${auth.currentUser.uid}/subscriptions`), newSubscriptions);
}

export async function deleteClip(key) {
  await remove(ref(db, 'clips/' + key));
}

export async function getClip(clipKey) {
  try {
    const snap = await get(child(ref(db), `clips/${clipKey}`));
    if (snap.exists()) return { ...snap.val() };
  } catch (error) {
    console.error(error);
  }
  return null;
}

export function addOwnClipsListner(callback) {
  if (!auth.currentUser) return null;

  const clipsRef = query(ref(db, 'clips'),
    orderByChild('createdBy'),
    equalTo(auth.currentUser.uid));

  const listner = onValue(clipsRef, (snapshot) => {
    let out = [];
    snapshot.forEach((child) => {
      let clip = { key: child.key, ...child.val() };
      out.push(clip);
    });
    out.sort((a, b) => { return b.updatedOn - a.updatedOn; })
    callback(out);
  });
  return { callback: listner, ref: clipsRef };
}

export function createClipLoader(key, onLoad) {
  const clipRef = query(ref(db, 'clips/' + key));
  const listner = onValue(clipRef, (snapshot) => {
    if (snapshot.size !== 0) {
      const clip = { ...snapshot.val() };
      onLoad(clip)
    } else {
      onLoad(null);
    }
  });
  return { callback: listner, ref: clipRef };
}

export function createSubClipsLoader(onLoad) {
  const userRef = query(ref(db, 'users/' + auth.currentUser.uid));
  const listner = onValue(userRef, (snapshot) => {
    console.log("SUBS LOADED:", snapshot);
    let clipKeys = [];
    if (snapshot.size === 1 && snapshot.val().subscriptions) {
      clipKeys = snapshot.val().subscriptions.split(" ");
    }

    onLoad(clipKeys);
  });
  return { callback: listner, ref: userRef };
}

export function createOwnClipsLoader(onLoad) {
  const clipsRef = query(ref(db, 'clips'), orderByChild('createdBy'), equalTo(auth.currentUser.uid));
  const listner = onValue(clipsRef, (snapshot) => {
    let out = [];
    snapshot.forEach((child) => {
      out.push(child.key);
    });
    onLoad(out);
  });
  return { callback: listner, ref: clipsRef };
}

export function removeListner(obj) {
  if (!obj) return;
  off(obj.ref, undefined, obj.callback);
}
