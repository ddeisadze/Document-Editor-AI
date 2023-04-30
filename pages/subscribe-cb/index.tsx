import { useRouter } from 'next/router'
import { useEffect } from 'react';
import Stripe from 'stripe';

export default function App() {
    const router = useRouter()

    const apiKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error("stripe API key empty.");

    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "", {
        apiVersion: '2022-11-15'
    });

    useEffect(() => {
        const session_id = router.query["session"] as string;

        if (!session_id) throw new Error("Cannot find session id from callback.")

        console.log(stripe.checkout.sessions.retrieve(session_id)
            .then(e => console.log(e))
            .catch(err => console.log(err)))

        console.log(stripe.checkout.sessions.listLineItems(session_id)
            .then(e => console.log(e))
            .catch(err => console.log(err)))
    }, [router.query])

    return (
        <p>test</p>
        // <DocumentEditorPage />
    );
}