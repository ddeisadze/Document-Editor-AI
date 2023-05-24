import { Delta as DeltaStatic } from "quill";
import { Batch } from "../components/automation/batchesDisplay";
import { aiCommentState } from "../components/documents/editor/DocumentEditor";

interface createNewDocument {
    id: string,
    content?: DeltaStatic,
    documentName: string,
    initialHtmlData?: string,
    aiComments?: aiCommentState[]
}

export interface documentStored {
    id: string,
    content?: DeltaStatic,
    documentName: string,
    initialHtmlData?: string,
    thumbnail?: string,
    aiComments: aiCommentState[]
}

export const createNewDocument = (doc: createNewDocument) => {
    const documentsFromLocalStorage = localStorage.getItem("documents");

    const existingDocuments: documentStored[] = documentsFromLocalStorage ? JSON.parse(documentsFromLocalStorage) : [];

    existingDocuments.push({
        id: doc.id,
        content: doc.content,
        documentName: doc.documentName,
        initialHtmlData: doc.initialHtmlData,
        aiComments: doc.aiComments ?? []
    });

    localStorage.setItem("documents", JSON.stringify(existingDocuments));
}

export const getDocuments = (): documentStored[] => {
    console.log(localStorage)
    const documentsString = localStorage.getItem("documents");
    const documents: documentStored[] = documentsString
        ? JSON.parse(documentsString)
        : [];

    return documents;
}

export const getDocument = (id: string): documentStored | undefined => {
    const docs = getDocuments();
    return docs.find(doc => doc?.id == id);
}

export const updateDocuments = (mapFn: (doc: documentStored) => documentStored) => {
    const existingDocuments: documentStored[] = getDocuments();
    const updatedDocuments = existingDocuments.map(mapFn);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
}

export const updateSpecificDocumentWithComments = (id: string, aiComments: aiCommentState[]) => {
    const existingDocuments: documentStored[] = getDocuments();

    const docToUpdate = existingDocuments.findIndex(doc => doc?.id === id)

    if (docToUpdate > -1 && aiComments) {
        existingDocuments[docToUpdate].aiComments = aiComments
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

const NEW_USER_KEY = "myAppIsNewUser";

export const getIsNewUser = (): boolean => {
    const isNewUserStr = localStorage.getItem(NEW_USER_KEY);
    return isNewUserStr ? JSON.parse(isNewUserStr) : true;
};

export const setIsNewUser = (isNewUser: boolean): void => {
    localStorage.setItem(NEW_USER_KEY, JSON.stringify(isNewUser));
};