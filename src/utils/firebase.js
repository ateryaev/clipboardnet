import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, update, query, orderByChild, onValue, equalTo, serverTimestamp, remove, get, child, push, onDisconnect } from "firebase/database";
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

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function createConnectionListner(onConnectionChange) {
  const connectedRef = ref(db, '.info/connected');
  return onValue(connectedRef, async (snap) => {
    if (snap.val() === true) {
      await signInAnonymously(auth);
      const uid = auth.currentUser.uid;
      const disconnectedOnRef = ref(db, `users/${uid}/disconnectedOn`);
      const connectedOnRef = ref(db, `users/${uid}/connectedOn`);
      set(connectedOnRef, serverTimestamp());
      onDisconnect(disconnectedOnRef).set(serverTimestamp());
    }
    onConnectionChange(snap.val());
  });
}

function generateCode() {
  //const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ1234567890"; 
  //1=I, 0=D=Q=O, 2=Z, 8=B, 5=S, V=W=Y, 6=G
  const chars = "ACEFHJKLMNPRTUVX1234567890";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(chars.length * Math.random()));
  }
  return code;
}
export function clampCode(code) {
  //1=I, 0=D=Q=O, 2=Z, 8=B, 5=S, V=W=Y, 6=G
  code = code.trim().toUpperCase();
  code = code.replaceAll("I", "1");
  code = code.replaceAll("D", "0");
  code = code.replaceAll("Q", "0");
  code = code.replaceAll("O", "0");
  code = code.replaceAll("Z", "2");
  code = code.replaceAll("B", "8");
  code = code.replaceAll("S", "5");
  code = code.replaceAll("W", "V");
  code = code.replaceAll("Y", "V");
  code = code.replaceAll("G", "6");
  return code;
}

export async function addClip(text) {
  if (!auth.currentUser) return;
  const code = generateCode();
  let clip = {};
  clip.createdBy = auth.currentUser.uid;
  clip.text = text;
  clip.updatedOn = clip.createdOn = serverTimestamp();
  await set(ref(db, 'clips/' + code), clip);
  return code;
}

export async function updateClip(code, text) {
  code = clampCode(code);
  if (code.length < 5) return;
  let clip = {};
  clip.text = text;
  clip.updatedOn = serverTimestamp();
  await update(ref(db, 'clips/' + code), clip);
}

export async function updateSubscription(code, subscribed) {
  if (!auth.currentUser) return;
  const subsRef = ref(db, `users/${auth.currentUser.uid}/subscriptions`);
  const snap = await get(subsRef);
  let subs = [];
  if (snap.exists()) {
    subs = snap.val().split(" ");
    subs = subs.filter((subCode) => subCode !== code);
  }
  if (subscribed) subs.push(code);
  await set(subsRef, subs.join(" "));
}

export async function deleteClip(code) {
  code = clampCode(code);
  if (code.length < 5) return;
  await remove(ref(db, 'clips/' + code));
}

export async function getClip(code) {
  code = clampCode(code);
  if (code.length < 5) return null;
  try {
    const snap = await get(child(ref(db), `clips/${code}`));
    if (snap.exists()) return { code, exists: true, ...snap.val() };
  } catch (error) {
    console.error(error);
  }
  return null;
}

export function createClipLoader(code, onLoad) {
  const clipRef = query(ref(db, 'clips/' + code));
  return onValue(clipRef, async (snapshot) => {
    let clip = { code, text: "", createdBy: 0, updatedBy: 0, exist: false };
    if (snapshot.size !== 0) clip = { code, ...snapshot.val(), exists: true };
    onLoad(clip);
  });
}

export function createSubsListner(onLoad) {
  if (!auth.currentUser) {
    onLoad([]);
    return () => { };
  }
  const userRef = query(ref(db, `users/${auth.currentUser.uid}`));
  return onValue(userRef, (snapshot) => {
    //console.log("SUBS LOADED:", snapshot.val(), snapshot.size, snapshot.exists());
    let clipKeys = [];
    if (snapshot.exists() && snapshot.val().subscriptions) {
      clipKeys = snapshot.val().subscriptions.split(" ");
    }
    onLoad(clipKeys);
  });
}

export function createOwnsListner(onLoad) {
  if (!auth.currentUser) {
    onLoad([]);
    return () => { };
  }
  const clipsRef = query(ref(db, 'clips'), orderByChild('createdBy'), equalTo(auth.currentUser.uid));
  return onValue(clipsRef, (snapshot) => {
    let out = [];
    snapshot.forEach((child) => {
      out.push(child.key);
    });
    onLoad(out);
  });
}
