import React, { useEffect, useRef, useState } from "react";
import { createConnectionListner, createOwnsListner, createSubsListner } from "./utils/firebase";
import { PageAllClips } from './components/PageAllClips';
import { PageWatch } from './components/PageWatch';
import { DialogConfirmExit, DialogDelete, PageEdit } from './components/PageEdit';
import { PageCreate } from './components/PageCreate';
import { DialogSearch } from "./components/DialogSearch";
import { Modal } from "./components/Window";

export default function App() {
  const PAGE_ALL = "PAGE_ALL";
  const PAGE_SEARCH = "PAGE_SEARCH";
  const PAGE_CREATE = "PAGE_CREATE";
  const PAGE_WATCH = "PAGE_WATCH";
  const PAGE_DELETE = "PAGE_DELETE";
  const PAGE_EDIT = "PAGE_EDIT";
  const PAGE_CONFIRM_EXIT_EDIT = "PAGE_CONFIRM_EXIT_EDIT";


  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState(PAGE_ALL);
  const [selectedCode, setSelectedCode] = useState("");
  const [subCodes, setSubCodes] = useState([]);
  const [ownCodes, setOwnCodes] = useState([]);

  useEffect(() => createConnectionListner(setConnected), []);
  useEffect(() => createSubsListner(setSubCodes), [connected]);
  useEffect(() => createOwnsListner(setOwnCodes), [connected]);

  useEffect(() => {
    window.history.replaceState(PAGE_ALL, "");
    window.onpopstate = function (e) {
      console.log("onpopstate", e.state)
      setPage(e.state);
    }
  }, [])

  //window.history.pushState(PAGE_PREVIEW, null);

  function historyGo(page) {
    console.log("pushState", page)
    window.history.pushState(page, null);
    setPage(page);
  }
  function historyBack() {
    window.history.back();
  }

  function goMain() {
    historyGo(PAGE_ALL);
    //window.history.go(steps ? -steps : -1);
    // window.history.go(-2);

    // setTimeout(() => {
    //   window.history.replaceState(PAGE_ALL, null);
    //   setPage(PAGE_ALL);
    // }, 100)
    /*window.history.replaceState(PAGE_ALL, null); setPage(PAGE_ALL);*/
  }
  function goSearch() { historyGo(PAGE_SEARCH); }
  function goCreate() { historyGo(PAGE_CREATE); }
  function goEdit(code) { setSelectedCode(code); historyGo(PAGE_EDIT); }
  //function cancelToEdit() { setPage("EDIT"); }

  function goWatch(code) { setSelectedCode(code); historyGo(PAGE_WATCH); }
  function goDelete(code) { setSelectedCode(code); historyGo(PAGE_DELETE); }
  function goConfirmExitEdit() { historyGo(PAGE_CONFIRM_EXIT_EDIT); }
  //function goConfirmExitCreate() { historyGo(PAGE_CONFIRM_EXIT_EDIT); }

  if (!connected) {
    return (<Modal fg="gray-200">
      <div className="text-center">
        connecting to server...
      </div></Modal>);
  } else {
    return (<div className="App max-w-[1024px] min-h-[100svh]">
      {(page === PAGE_EDIT || page === PAGE_DELETE || page === PAGE_CONFIRM_EXIT_EDIT) &&
        <PageEdit
          code={selectedCode}
          onSelectDelete={goDelete}
          onSelectConfirmExit={goConfirmExitEdit}
          onCancel={historyBack}
          disabled={page !== PAGE_EDIT} />}

      {page === PAGE_CONFIRM_EXIT_EDIT &&
        <DialogConfirmExit
          onCancel={historyBack}
          onConfirm={goMain} />}

      {page === PAGE_DELETE && <DialogDelete
        code={selectedCode}
        onDeleted={goMain}
        onCancel={historyBack} />}

      {page === PAGE_CREATE && <PageCreate
        onCreated={goEdit}
        onCancel={historyBack} />}

      {page === PAGE_WATCH && <PageWatch
        subscribed={subCodes.includes(selectedCode)}
        code={selectedCode}
        onCancel={historyBack} />}

      <PageAllClips
        owns={ownCodes}
        subs={subCodes}
        onSelectOwn={goEdit}
        onSelectSub={goWatch}
        onSelectCreate={goCreate}
        onSelectSearch={goSearch}
        hidden={page !== PAGE_ALL && page !== PAGE_SEARCH}
        disabled={page !== PAGE_ALL}
      />

      {page === PAGE_SEARCH &&
        <DialogSearch onCancel={historyBack} onFound={goWatch} />
      }
    </div>);
  }
}
