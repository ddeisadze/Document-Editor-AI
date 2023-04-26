import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DocumentEditorPage from './DocumentPage';
import { DocumentManager } from '../components/documents/Gallery';

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/linkedin" element={<LinkedInCallback />} />
                <Route path="/document/:id" Component={DocumentEditorPage} />
                <Route path="/" Component={DocumentManager} />

            </Routes>
        </BrowserRouter>
    );
}