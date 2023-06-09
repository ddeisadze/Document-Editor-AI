import { atom } from 'jotai';
import { DocumentProps, aiChatProps, MessageModelProps } from '../types';
import { DeltaStatic,  } from "quill";


export const documentsAtom = atom<DocumentProps[]>([]);

export const documentAtom = atom<DocumentProps | null>(null);
export const lastModifiedAtom = atom<Date | null>(null);

export const documentIdAtom = atom<string>('');
export const documentNameAtom = atom<string>('');
export const aiChatsAtom = atom<aiChatProps[]>([]);
export const thumbnailAtom = atom<string | undefined>(undefined);
export const contentAtom = atom<DeltaStatic | null>(null);

// export const aiChatAtom = atom<aiChatProps | null>(null); 
// export const chatIdAtom = atom<string>('');
// export const isOpenAtom = atom<boolean | undefined>(undefined);
// export const rangeAtom = atom<Range | undefined>(undefined);
// export const selectedTextAtom = atom<string>('');
// export const topAtom = atom<number | undefined>(undefined);
// export const bottomAtom = atom<number | undefined>(undefined);
// export const leftAtom = atom<number | undefined>(undefined);
// export const rightAtom = atom<number | undefined>(undefined);
// export const widthAtom = atom<string>('');
// export const messageHistoryAtom = atom<MessageModelProps[]>([]);

// export const messageAtom = atom<string>('');
// export const sentTimeAtom = atom<string>('');
// export const senderAtom = atom<string>('');
// export const directionAtom = atom<string>('');
// export const positionAtom = atom<string>('');


