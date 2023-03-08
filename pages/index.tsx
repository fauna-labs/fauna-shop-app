import { Client } from 'fauna';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserContext } from '../store/state';

const Home: NextPage = () => {
  const router = useRouter();

  const [products, setProducts] = useState([] as any);

  const userCtx = useUserContext() as any;
  const { setCart } = userCtx;

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      searchProduct();
    } else {
      getAllProduct();
    }
  }, [router.query]);

  const searchProduct = async () => {
    try {
      let categories = router.query.category as string;
      const categoryArray = JSON.stringify(categories.split(','));
      const response = await client.query({
        query: `
        let matchCat = ${categoryArray}
        Product.all.where(
          (.price > ${router.query.priceMin} && .price < ${router.query.priceMax} ) &&
          (.name.toLowerCase().includes("${router.query.searchTerm}"))
        )
        .where(p => 
          matchCat.map(c => p.category.includes(c)).includes(true)
        )
        .order(desc(.ts))
        `
      })
      setProducts(response.data.data);
    } catch (error) {
      console.log('error', error);
      alert("Product not found!");
    }
  };

  const getAllProduct = async () => {
    try {
      const response = await client.query({
        query: `Product.all.order(asc(.ts))`
      })
      console.log('All Products :-', response.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.log('error', error);
      alert("Product not found!");
    }
  };

  const addToCart = (product: any) => {
    setCart((prev: any) => [...prev, product]);
  };

  return (
    <div className="p-2 container mx-auto">
      <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 mt-4">
        {
          products?.map((product: any) => (
            <a 
              key={product.id}
              className="flex flex-col border border-gray-900 p-3 rounded-md max-w-xs">
              <div>
                <h1 className="text-xl">{product.name}</h1>
                <p className="text-sm">{product.description}</p>
                <p className="text-sm">$ {product.price}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img src={product.img} alt={product.name} className="w-32 h-44" />
                <button 
                  className="border border-gray-800 mt-2 rounded-md p-1 hover:bg-purple-200"
                  onClick={() => addToCart(product)}
                >
                  <span className="text-md">Add to Cart</span>
                </button>
              </div>
            </a>
          ))
        }
      </div>
    </div>
  )
}

export default Home;
