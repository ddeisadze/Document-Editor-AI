
import dynamic from 'next/dynamic'
import SimpleSidebar from '../../src/components/sidebar/verticalSidebar';
import { test_resume_html } from '../../src/utility/sampleData';

const DocumentEditor = dynamic(() => import('../../src/components/documents/editor/DocumentEditor').then(module => module.DocumentEditor), {
    ssr: false,
})

export default function App() {
    return (
        <SimpleSidebar>
            <DocumentEditor documentHtml={test_resume_html} documentName={"Test Resume"} />
        </SimpleSidebar>
    );
}