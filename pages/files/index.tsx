import dynamic from 'next/dynamic'


const DocumentManagerPage = dynamic(() => import('../../src/components/documents/Gallery'), {
    ssr: false,
})
export default function App() {
    return (
        <DocumentManagerPage />
    );
}