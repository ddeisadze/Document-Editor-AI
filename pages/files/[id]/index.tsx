import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { documentStored, getDocuments } from "../../../src/utility/storageHelpers";

const DocumentPage = dynamic(() => import("../../../src/pages/DocumentPage"), {
  ssr: false,
});


export default function DocumentPageById() {
  const [document, setDocument] = useState<documentStored>();

  const router = useRouter();

  useEffect(() => {
    if (!router.query.id) return;

    const id: string = router.query.id as string;

    const documents: documentStored[] = getDocuments() ?? []

    const existingDocument = documents.find(
      (document) => document?.id?.toString() === id
    );

    if (existingDocument) {
      setDocument(existingDocument);

    }
  }, [router.query]);


  return (
    <>
      {document && (
        <DocumentPage
          documentId={document.id}
          documentContent={document.content}
          documentName={document.documentName}
          initialHtmlContent={document.initialHtmlData}
          aiComments={document.aiComments}
        />
      )}
    </>
  );
}
