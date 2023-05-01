import dynamic from 'next/dynamic'

const DocumentEditorPage = dynamic(() => import('../src/pages/DocumentPage'), {
    ssr: false,
})

export default function App() {
    return (
        <DocumentEditorPage blank />
    );
}