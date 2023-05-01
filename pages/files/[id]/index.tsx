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
    console.log(router.query.id);

    const id: string = router.query.id as string;

    const documents: documentStored[] = getDocuments() ?? []

    console.log(documents)

    const existingDocument = documents.find(
      (document) => document?.id?.toString() === id
    );

    if (existingDocument) {
      setDocument(existingDocument);

    }
  }, [router.query]);

  console.log(document)

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
