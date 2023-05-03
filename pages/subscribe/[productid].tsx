import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Price, ProductWithPrice } from "../../types";
import { postData } from "../../utils/helpers";
import { getStripe } from "../../utils/stripe-client";
import { getActiveProductsWithPrices } from "../../utils/supabase-client";
import { useUser } from '../../utils/useUser';

type BillingInterval = 'year' | 'month';

interface Props {
    product: ProductWithPrice;
}

export default function FeeSubscriptionPlan({ product }: Props) {
    const router = useRouter();
    const [billingInterval, setBillingInterval] =
        useState<BillingInterval>('month');
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const { user, isLoading, subscription } = useUser();

    console.log(user);

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        console.log(user, subscription)

        if (!user) {
            return router.push({
                pathname: '/auth/signin',
                query: {
                    callback: `${router.asPath}`
                }
            });
        }

        if (subscription) {
            return router.push(
                {
                    pathname: process.env.NEXT_PUBLIC_SITE_URL ?? '',
                    query: {
                        state: `welcome`
                    }
                });
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert("Error.");
        } finally {
            setPriceIdLoading(undefined);
        }
    };

    const price = product?.prices?.find(
        (price) => price.interval === billingInterval
    );

    if (!price) throw new Error({ title: "Could not find price.", statusCode: 500 })


    useEffect(() => {
        if (isLoading) return;
        handleCheckout(price)

    }, [isLoading])



    return <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Text>Loading...</Text>
    </Flex>
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<GetServerSidePropsResult<Props>> => {
    const products = await getActiveProductsWithPrices();

    const productId = decodeURIComponent(context?.query?.productid as string ?? "")

    const product = products.find(a => a.name === productId)
    if (!product) {
        console.log("could not find")
        throw new Error({ title: "Could not find product.", statusCode: 500 })
    }

    return {
        props: {
            product
        },
    };
}