import { ChakraProvider } from '@chakra-ui/react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DiffViewer from '../components/documents/diff/DiffViewer';
import { DocumentEditor } from '../components/documents/editor/DocumentEditor';
import NavigationBar from '../components/sidebar/verticalSidebar';
import { test_resume_html } from '../utility/sampleData';
import DocumentEditorPage from './DocumentPage';

export default function TestPage() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={DocumentEditorPage} />
                <Route path="/test-editor" element={
                    <NavigationBar>
                        <DocumentEditor documentHtml={test_resume_html} documentName={"Test Resume"} />
                    </NavigationBar>
                } />

                <Route path="/test-diff" element={
                    <DiffViewer
                        onAcceptChanges={() => { }}
                        onClose={() => { }}
                        AiMessages={[]}
                        isOpen={true}
                        oldText='Dynamic, results-driven, and accomplished Product Leader with significant success in leveraging enterprise-wide technology transformation experience to drive business strategy and innovation. Champions collaborative use of technology to create meaningful and impactful improvements to the customer experience. Develops, trains, and mentors top-performing technology teams; builds powerful partnerships at the Senior Executive level to bring about transformational change rapidly using the most advanced modern technologies. A forward-facing visionary recognized for spearheading strategic thought leadership. Pragmatically applies expansive technology expertise to real business problems; designs, builds, and deploys systems based on solid business plans and cost-effective use of technology. Proactive, resourceful, and respected. '
                        newText='Accomplished Product Leader with a successful track record in leveraging enterprise-wide technology transformation experience to drive business strategy and innovation. Expertise in designing, building, and deploying systems based on solid business plans and cost-effective use of technology. Proactive and resourceful approach to problem-solving. Demonstrated success in mentoring and training high-performing technology teams. Strong partnerships at the senior executive level, recognized for thought leadership and driving transformational change using the most advanced modern technologies.' />
                } />
            </Routes>
        </BrowserRouter>
    );
}