import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import { DeltaOperation, Sources, Quill as typesQuill } from "quill/index";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "axios";

import "quill/dist/quill.snow.css";
import { socket } from "../socket";
import { TOOLBAR_OPTIONS } from "./utils/ToolbarOptions";

export default function Doc() {
  const { id: docId } = useParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contents, setContents] = useState<DeltaOperation | null>(null);
  const [quill, setQuill] = useState<any>(null);

  const toggleConnected: () => void = () => {
    setIsConnected((isConnected) => !isConnected);
  };

  const getDocThumbnail: () => void = async () => {
    const page = document.getElementById("container");
    const canvas = await html2canvas(page!, { scale: 0.5 });

    const thumbnail = canvas.toDataURL(`${docId}thumbnail/png`);

    await axios.post("http://localhost:4000/saveDocThumbnail", {
      docId,
      thumbnail,
    });
  };

  // Load Doc
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.emit("get-doc", docId);

    socket.once("load-doc", (doc) => {
      quill.setContents(doc);
      quill.enable();
    });
  }, [socket, quill, docId]);

  // Save Doc
  useEffect(() => {
    if (socket == null || quill == null) return;

    const timeout = setTimeout(() => {
      socket.emit("save-doc", quill.getContents());

      getDocThumbnail();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [contents]);

  // Socket and Quill
  useEffect(() => {
    socket.connect();
    toggleConnected();

    const quill: typesQuill = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    quill.disable();
    quill.setText("Loading...");

    setQuill(quill);

    return () => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = "<div id='container'></div>";
      }

      socket.disconnect();
      toggleConnected();
    };
  }, []);

  if (quill) {
    quill.on(
      "text-change",
      function (
        delta: DeltaOperation,
        oldDelta: DeltaOperation,
        source: Sources
      ) {
        if (source == "api") {
          console.log("An API call triggered this change.");
        } else if (source == "user") {
          const content: DeltaOperation = quill.getContents();

          isConnected && socket.emit("text-change", content);

          setContents(content);
        }
      }
    );

    socket.on("text-changed", (content: DeltaOperation) => {
      quill.setContents(content);
    });
  }

  return <div id="container"></div>;
}
