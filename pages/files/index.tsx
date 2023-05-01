import dynamic from 'next/dynamic'
import NavigationBar from '../../src/components/sidebar/verticalSidebar';

const Gallery = dynamic(() => import('../../src/components/documents/Gallery'), {
    ssr: false,
})

export default function App() {
    return (
        <NavigationBar showExport={false}>
            <Gallery />
        </NavigationBar>
    );
}