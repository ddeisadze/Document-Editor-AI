import { Delta as DeltaStatic } from "quill";
import { Batch } from "../components/automation/batchesDisplay";
import { aiCommentState } from "../components/documents/editor/DocumentEditor";
import { SetStateAction, useAtomValue, useSetAtom} from 'jotai';
import { documentsAtom, documentAtom, aiChatsAtom } from "../store/atoms/documentsAtom";
import { DocumentProps, aiChatProps } from "../store/types";
import { NextRouter } from "next/router";




interface createNewDocument {
    content?: DeltaStatic,
    documentName: string,
    aiChats?: aiChatProps[]
}

// export interface documentStored {
//     id: string,
//     content?: DeltaStatic,
//     documentName: string,
//     initialHtmlData?: string,
//     thumbnail?: string,
//     aiComments: aiCommentState[]
// }

export const CreateNewDocument = (doc : DocumentProps, setDocumentAtom : any, aiChats : aiChatProps[], setDocumentId: any, router : NextRouter) => {
    const date = new Date().getTime().toString()
    setDocumentId(date)


  
    const documentsFromLocalStorage = localStorage.getItem('documents');
  
    const existingDocuments = documentsFromLocalStorage ? JSON.parse(documentsFromLocalStorage) : [];
    console.log(doc.content, 'content');
  
    const newDocument = {
      id: date,
      content: doc.content,
      documentName: doc.documentName,
      aiChats: doc.aiChats ?? aiChats,
    };
  
    existingDocuments.push(newDocument);
  
    setDocumentAtom(newDocument);
  
    localStorage.setItem('documents', JSON.stringify(existingDocuments));

        router.push(`/files/${encodeURIComponent(date)}`);

  };


export const getDocuments = (): DocumentProps[] => {
    const documentsString = localStorage.getItem("documents");
    const documents: DocumentProps[] = documentsString
        ? JSON.parse(documentsString)
        : [];

    return documents;
}

export const getDocument = (id: string): DocumentProps | undefined => {
    const docs = getDocuments();
    return docs.find(doc => doc?.id == id);
}

export const updateDocuments = (mapFn: (doc: DocumentProps) => DocumentProps) => {
    const existingDocuments: DocumentProps[] = getDocuments();
    const updatedDocuments = existingDocuments.map(mapFn);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
}

export const updateSpecificDocumentWithComments = (id: string, aiChats: aiChatProps[]) => {
    const existingDocuments: DocumentProps[] = getDocuments();

    const docToUpdate = existingDocuments.findIndex(doc => doc?.id === id)

    if (docToUpdate > -1 && aiChats) {
        existingDocuments[docToUpdate].aiChats = aiChats
    }

    localStorage.setItem("documents", JSON.stringify(existingDocuments));
}

export const setBatchesLocalStorage = (batches: Batch[]) => {
    localStorage.setItem("batches", JSON.stringify(batches))
}

export const getBatches: () => Batch[] = () => {
    const batchString = localStorage.getItem("batches")
    return batchString ? JSON.parse(batchString) as Batch[] : []
}