import { ChakraProvider } from '@chakra-ui/react';

import dynamic from 'next/dynamic'

const DiffViewer = dynamic(() => import('../src/components/documents/diff/DiffViewer'), {
    ssr: false,
})

export default function App() {
    return (
        <ChakraProvider>
            <DiffViewer
                onAcceptChanges={() => { }}
                onClose={() => { }}
                AiMessages={[]}
                isOpen={true}
                oldText='Dynamic, results-driven, and accomplished Product Leader with significant success in leveraging enterprise-wide technology transformation experience to drive business strategy and innovation. Champions collaborative use of technology to create meaningful and impactful improvements to the customer experience. Develops, trains, and mentors top-performing technology teams; builds powerful partnerships at the Senior Executive level to bring about transformational change rapidly using the most advanced modern technologies. A forward-facing visionary recognized for spearheading strategic thought leadership. Pragmatically applies expansive technology expertise to real business problems; designs, builds, and deploys systems based on solid business plans and cost-effective use of technology. Proactive, resourceful, and respected. '
                newText='Accomplished Product Leader with a successful track record in leveraging enterprise-wide technology transformation experience to drive business strategy and innovation. Expertise in designing, building, and deploying systems based on solid business plans and cost-effective use of technology. Proactive and resourceful approach to problem-solving. Demonstrated success in mentoring and training high-performing technology teams. Strong partnerships at the senior executive level, recognized for thought leadership and driving transformational change using the most advanced modern technologies.' />
        </ChakraProvider>
    );
}