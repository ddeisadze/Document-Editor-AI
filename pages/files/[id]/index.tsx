import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DeltaStatic } from "quill";

import dynamic from "next/dynamic";

const DocumentPage = dynamic(() => import("../../../src/pages/DocumentPage"), {
  ssr: false,
});

type Props = {
  params: any;
};

export default function index({ params }: Props) {
  const [documents, setDocuments] = useState([]);
  const [content, setContent] = useState<DeltaStatic | undefined>();

  const router = useRouter();

  useEffect(() => {
    if (!router.query.id) return;
    console.log(router.query.id);

    const id: string = router.query.id as string;

    const documentsString = localStorage.getItem("documents");
    const documents = documentsString ? JSON.parse(documentsString) : [];
    setDocuments(documents);
    const existingDocument = documents.find(
      (document: { id: number }) => document.id.toString() === id
    );
    console.log(existingDocument);
    if (existingDocument) {
      setContent(existingDocument.content);
    }
  }, [router.query]);

  // const documentsString = localStorage.getItem("documents");
  // const documents = documentsString
  //   ? JSON.parse(documentsString)
  //   : (null as Array<any> | null);

  // const existingDocument = documents.find((document: any) => document.id === id);

  // console.log(id, existingDocument, "hello", "yoloy");

  return (
    <>
      {content && (
        <DocumentPage documentContent={content} documentName={"test"} />
      )}
    </>
  );
}
