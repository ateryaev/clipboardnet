import React, { useEffect, useState } from "react";
import { createConnectionListner, createOwnsListner, createSubsListner } from "./utils/firebase";
import { PageAllClips } from './components/PageAllClips';
import { PageWatch } from './components/PageWatch';
import { PageEdit } from './components/PageEdit';
import { PageCreate } from './components/PageCreate';
import { Modal } from "./components/Window";
import { Route, Routes } from "react-router-dom";

export default function App() {
  const [connected, setConnected] = useState(false);
  const [subCodes, setSubCodes] = useState([]);
  const [ownCodes, setOwnCodes] = useState([]);

  useEffect(() => createConnectionListner(setConnected), []);
  useEffect(() => createSubsListner(setSubCodes), [connected]);
  useEffect(() => createOwnsListner(setOwnCodes), [connected]);

  if (!connected) {
    return (<Modal fg="gray-200">
      <div className="text-center">
        connecting to server...
      </div></Modal>);
  } else {
    return (<div className="App max-w-[1024px] min-h-[100svh]">
      <Routes>
        <Route path="/" title="All Clipboard" element=<PageAllClips owns={ownCodes} subs={subCodes} /> />
        <Route path="/watch/:code" element=<PageWatch /> />
        <Route path="/edit/:code" element=<PageEdit /> />
        <Route path="/create" element=<PageCreate /> />
      </Routes>
    </div>);
  }
}
