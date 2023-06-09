import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import {
  getDocuments,
} from "../../../src/utility/storageHelpers";

import { documentAtom, documentIdAtom, documentNameAtom, aiChatsAtom, contentAtom } from "../../../src/store/atoms/documentsAtom";
import { DocumentProps } from "../../../src/store/types";
import { useAtom } from "jotai";

const DocumentPage = dynamic(() => import("../../../src/pages/DocumentPage"), {
  ssr: false,
});

export default function DocumentPageById() {
  const [document, setDocument] = useAtom(documentAtom);
  const [documentId, setDocumentId] = useAtom(documentIdAtom);
  const [documentName, setDocumentName] = useAtom(documentNameAtom);
  const [aiChats, setAiChats] = useAtom(aiChatsAtom);
  const [content, setContent] = useAtom(contentAtom);
  console.log("logggg");
  

  const router = useRouter();

  useEffect(() => {
    if (!router.query.id) return;

    const id: string = router.query.id as string;

    const documents: DocumentProps[] = getDocuments() ?? [];

    const existingDocument = documents.find(
      (document) => document?.id?.toString() === id
    );

    if (existingDocument) {
      setDocument(existingDocument);
      setDocumentId(existingDocument.id)
      setDocumentName(existingDocument.documentName)
      setAiChats(existingDocument.aiChats ?? [])
      setContent(existingDocument.content ?? null)

    }
  }, [router.query]);

  return (
    <>
      {document && (
        <DocumentPage
          documentName={document.documentName}
        />
      )}
    </>
  );
}
