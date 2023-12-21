//import './App.css';
import React, { useEffect, useState } from "react";
import { signIn, createOwnClipsLoader, createSubClipsLoader, removeListner } from "./utils/firebase";
import { PageAllClips } from './components/PageAllClips';
import { UserContext } from './components/UserContext';
import { PageClipView } from './components/PageClipView';
import { PageEdit } from './components/PageEdit';
import { PageCreate } from './components/PageCreate';

//const UserContext = createContext(null);

function App() {

  const [page, setPage] = useState("ALL");//VIEW, EDIT, ALL
  const [selectedClip, setSelectedClip] = useState("");

  const [userOnline, setUserOnline] = useState(false);
  const [ownClips, setOwnClips] = useState({});
  const [subKeys, setSubKeys] = useState([]);
  const [ownKeys, setOwnKeys] = useState([]);
  const [subClips, setSubClips] = useState({});

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

  function handleView(key) {
    console.log("CLIP:", key, page)
    setSelectedClip(key);
    setPage("VIEW");
  }
  function handleEdit(key) {
    console.log("CLIP:", key, page)
    setSelectedClip(key);
    //setSelectedClip("");
    setPage("EDIT");
  }
  function handleCreate() {
    setPage("CREATE");
  }
  function handleCreated(newKey) {
    setSelectedClip(newKey);
    setPage("EDIT");
  }

  return (
    <div className="App max-w-[1024px] min-h-[100svh]">
      <UserContext.Provider value={{ subClips, ownClips, userOnline }}>
        {page === "EDIT" && <PageEdit clipKey={selectedClip} subKeys={subKeys} onCancel={() => setPage("ALL")} />}
        {page === "CREATE" && <PageCreate onCreated={handleCreated} onCancel={() => setPage("ALL")} />}
        {page === "VIEW" && <PageClipView subKeys={subKeys} clipKey={selectedClip} onCancel={() => setPage("ALL")} />}
        {page === "ALL" && <PageAllClips
          ownKeys={ownKeys} subKeys={subKeys} recentKeys={["D0Z27J"]}
          onView={handleView}
          onCreate={handleCreate}
          onEdit={handleEdit} />}
      </UserContext.Provider>
    </div >
  );
}

export default App;
