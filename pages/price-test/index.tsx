
import { GetStaticPropsResult } from 'next';
import Pricing from '../../src/pricing-components/Pricing';
import { Product } from '../../types';
import { getActiveProductsWithPrices } from '../../utils/supabase-client';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  console.log(products)

  return <Pricing products={products} />;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  console.log(products)

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
