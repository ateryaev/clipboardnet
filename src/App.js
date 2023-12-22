//import './App.css';
import React, { useEffect, useMemo, useState } from "react";
import { signIn, createOwnClipsLoader, createSubClipsLoader, removeListner, createClipLoader, updateClip, deleteClip, sleep, addClip, getClip, updateUser } from "./utils/firebase";
import { PageAllClips } from './components/PageAllClips';
import { UserContext } from './components/UserContext';
import { PageClipView } from './components/PageClipView';
import { PageEdit } from './components/PageEdit';
import { PageCreate } from './components/PageCreate';
import { DialogSearch } from "./components/DialogSearch";

//const UserContext = createContext(null);

function App() {

  const [page, setPage] = useState("ALL");//VIEW, EDIT, ALL
  const [selectedCode, setSelectedCode] = useState("");

  const [userOnline, setUserOnline] = useState(false);

  const [subKeys, setSubKeys] = useState([]);
  const [ownKeys, setOwnKeys] = useState([]);

  const [ownClips, setOwnClips] = useState([]);
  const [subClips, setSubClips] = useState([]);

  const [processing, setProcessing] = useState(false);

  const [ctx, setCtx] = useState({ online: false, owns: {}, subs: {}, subKeys: [] });

  useEffect(() => {
    console.log("EFFECT []", ctx);
    (async () => {
      await signIn();
      console.log("SIGNED=TRUE");
      setUserOnline(true);
    })();
    return () => {
      console.log("LOGGING OUT...");
      setUserOnline(false);
    }
  }, []);

  useEffect(() => {
    //console.log("EFFECT [ctx.online]", ctx);
    if (!userOnline) return;

    const subKeysLoader = createSubClipsLoader((clipKeys) => {
      console.log("SUB CLIP KEYS WERE LOADED", clipKeys);
      setSubKeys(clipKeys);
    });

    const ownsLoader = createOwnClipsLoader((clips) => {
      console.log("OWN CLIPS WERE LOADED", clips);
      setOwnKeys(clips);
      //setOwnClips(clips);
    });

    return () => {
      console.log("STOP LISTENING CLIPS UPDATE");
      removeListner(ownsLoader);
      removeListner(subKeysLoader);
    }

  }, [userOnline]);

  const selectedClip = useMemo(() => {
    let clip = ownClips[selectedCode];
    if (!clip) clip = subClips[selectedCode];
    if (!clip) clip = {
      code: selectedCode,
      text: "",
      updatedBy: 0,
      exist: false
    }
    return clip;
  }, [selectedCode, ownClips, subClips]);

  useEffect(() => {
    if (!userOnline) return;
    let loaders = [];
    let loadedClips = {};
    if (ownKeys.length === 0) setOwnClips([]);
    ownKeys.forEach((code) => {
      const loader = createClipLoader(code, (clip) => {
        loadedClips[code] = clip;
        if (Object.keys(loadedClips).length === ownKeys.length) {
          setOwnClips(loadedClips);
        }
      });
      loaders.push(loader);
    });
    return () => {
      loaders.forEach((loader) => {
        removeListner(loader);
      });
    }
  }, [ownKeys]);

  useEffect(() => {
    if (!userOnline) return;
    let loaders = [];
    let loadedClips = {};
    if (subKeys.length === 0) setSubClips([]);
    subKeys.forEach((code) => {
      const loader = createClipLoader(code, (clip) => {
        loadedClips[code] = clip;
        if (Object.keys(loadedClips).length === subKeys.length) {
          setSubClips(loadedClips);
        }
      });
      loaders.push(loader);
    });
    return () => {
      loaders.forEach((loader) => {
        removeListner(loader);
      });
    }
  }, [subKeys]);

  function handleEdit(code) {
    console.log("CLIP:handleEdit", code, ownClips[code])
    setSelectedCode(code);
    //setSelectedClip("");
    setPage("EDIT");
  }

  async function handleUpdate(text) {
    await sleep(1000);
    await updateClip(selectedCode, text);
  }

  async function handleDelete() {
    await sleep(1000);
    await deleteClip(selectedCode);
    await sleep(1000);
    goMain();
  }

  function goMain() { setPage("ALL"); }
  function goSearch() { setPage("SEARCH"); }
  function goCreate() { setPage("CREATE"); }
  function goView(code) { setSelectedCode(code); setPage("VIEW"); }

  async function handleCreate(text) {
    await sleep(1000);
    const newText = text.trim();
    const newKey = await addClip(newText);
    setSelectedCode(newKey);
    setPage("EDIT");
  }

  async function handleSearch(code) {
    await sleep(1000);
    const clip = await getClip(code);
    if (!clip) return false;
    goView(clip.code);
    return true;
  }

  async function handleSubscribeChange() {
    await sleep(1000);
    const subcribed = subKeys.includes(selectedCode);
    let newSubs = [];
    if (!subcribed) {
      console.log("ADD");
      newSubs = subKeys.slice();
      newSubs.push(selectedCode);
    } else {
      console.log("REMOVE")
      newSubs = subKeys.filter((code) => code !== selectedCode);
    }
    console.log("NEW SUBS", newSubs)
    await updateUser(newSubs);
  }

  return (
    <div className="App max-w-[1024px] min-h-[100svh]">
      <UserContext.Provider value={{ subClips, ownClips, userOnline }}>
        {page === "EDIT" && <PageEdit
          clip={selectedClip}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          onCancel={goMain} />}

        {page === "CREATE" && <PageCreate
          onCreate={handleCreate}
          onCancel={goMain} />}

        {page === "VIEW" && <PageClipView
          subscribed={subKeys.includes(selectedCode)}
          clip={selectedClip}
          onSubscribeChange={handleSubscribeChange}
          subKeys={subKeys} clipKey={selectedCode} onCancel={goMain} />}

        {(page === "ALL" || page === "SEARCH") && <PageAllClips
          owns={ownClips}
          subs={subClips}
          onView={(code) => goView(code)}
          onCreate={goCreate}
          onEdit={handleEdit}
          onWantSearch={goSearch} />}

        {page === "SEARCH" &&
          <DialogSearch onCancel={goMain} onSearch={handleSearch} />
        }

      </UserContext.Provider>
    </div >
  );
}

export default App;
