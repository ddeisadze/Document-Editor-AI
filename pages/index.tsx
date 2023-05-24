import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getIsNewUser } from '../src/utility/storageHelpers';

const DocumentEditorPage = dynamic(() => import('../src/pages/DocumentPage'), {
    ssr: false,
})

export default function App() {
    const router = useRouter();

    useEffect(() => {
        if (getIsNewUser()) {
            router.replace('/demo')
        }
    }, [])
    return (
        <DocumentEditorPage documentId='test' blank />
    );
}