
import dynamic from 'next/dynamic';
import { ReadonlyContext } from '../src/contexts';

const DocumentPageTour = dynamic(() => import('../src/tours/DocumentPageTour'), {
    ssr: false,
})

export default function App() {
    return (

        <ReadonlyContext.Provider value={{ readonly: false, showComments: true, joyride: true }}>
            <DocumentPageTour />
        </ReadonlyContext.Provider>


    );
}