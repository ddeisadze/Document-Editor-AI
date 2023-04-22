import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DocumentEditorPage from './DocumentPage';

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/linkedin" element={<LinkedInCallback />} />
                <Route path="/" Component={DocumentEditorPage} />
            </Routes>
        </BrowserRouter>
    );
}