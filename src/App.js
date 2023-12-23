import React, { useEffect, useState } from "react";
import { signIn, createOwnClipsLoader, createSubClipsLoader, deleteClip, getClip } from "./utils/firebase";
import { PageAllClips } from './components/PageAllClips';
import { UserContext } from './components/UserContext';
import { PageWatch } from './components/PageWatch';
import { DialogConfirmExit, DialogDelete, PageEdit } from './components/PageEdit';
import { PageCreate } from './components/PageCreate';
import { DialogSearch } from "./components/DialogSearch";

function App() {

  const [page, setPage] = useState("ALL");
  const [selectedCode, setSelectedCode] = useState("");
  const [userOnline, setUserOnline] = useState(false);
  const [subCodes, setSubCodes] = useState([]);
  const [ownCodes, setOwnCodes] = useState([]);

  useEffect(() => {
    (async () => {
      await signIn();
      setUserOnline(true);
    })();
    return () => setUserOnline(false);
  }, []);

  useEffect(() => createSubClipsLoader(setSubCodes), [userOnline]);
  useEffect(() => createOwnClipsLoader(setOwnCodes), [userOnline]);

  function goMain() { setPage("ALL"); }
  function goSearch() { setPage("SEARCH"); }
  function goCreate() { setPage("CREATE"); }
  function goEdit(code) { setSelectedCode(code); setPage("EDIT"); }
  function cancelToEdit() { setPage("EDIT"); }
  function goWatch(code) { setSelectedCode(code); setPage("WATCH"); }
  function goDelete(code) { setSelectedCode(code); setPage("DELETE"); }
  function goConfirmExitEdit() { setPage("CONFIRM_EXIT_EDIT"); }
  function goConfirmExitCreate() { setPage("CONFIRM_EXIT_CREATE"); }


  return (
    <div className="App max-w-[1024px] min-h-[100svh]">
      <UserContext.Provider value={{ userOnline }}>
        {(page === "EDIT" || page === "DELETE" || page === "CONFIRM_EXIT_EDIT") &&
          <PageEdit
            code={selectedCode}
            onSelectDelete={goDelete}
            onSelectConfirmExit={goConfirmExitEdit}
            onCancel={goMain} />}

        {page === "CONFIRM_EXIT_EDIT" &&
          <DialogConfirmExit
            onCancel={cancelToEdit}
            onConfirm={goMain} />}

        {page === "DELETE" && <DialogDelete
          code={selectedCode}
          onDeleted={goMain}
          onCancel={cancelToEdit} />}

        {page === "CREATE" && <PageCreate
          onCreated={goEdit}
          onCancel={goMain} />}

        {page === "WATCH" && <PageWatch
          subscribed={subCodes.includes(selectedCode)}
          code={selectedCode}
          onCancel={goMain} />}

        {(page === "ALL" || page === "SEARCH") && <PageAllClips
          owns={ownCodes}
          subs={subCodes}
          onSelectOwn={goEdit}
          onSelectSub={goWatch}
          onSelectCreate={goCreate}
          onSelectSearch={goSearch} />}

        {page === "SEARCH" &&
          <DialogSearch onCancel={goMain} onFound={goWatch} />
        }

      </UserContext.Provider>
    </div >
  );
}

export default App;
