import { Client } from "@fauna/fauna";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../store/state";

export default function ShopById() {

  const router = useRouter();
  const { id } = router.query;

  const userCtx = useUserContext() as any;
  const { user } = userCtx;

  const [shop, setShop] = useState<any>({});
  const [products, setProducts] = useState<any>([]);

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user?.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });


  useEffect(() => {
    getShopById();
  }, [id]);

  const getShopById = async () => {
    try {
      const response = await client.query({
        query: `
        let shop = Shop.byId("358520717703118925")
        let products = Product.all.where(.shop == shop)

        let result = {
          shop: shop,
          products: products
        }
        
        result
        `
      })
      console.log('response', response.data);
      setShop(response.data.shop);
      setProducts(response.data?.products?.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  
  return (
    <div className="p-2 container mx-auto">
      <h1 className="text-2xl font-bold">{shop.name}</h1>
      <p className="text-md">{shop.description}</p>
      <p className="text-md mb-2">{shop.countryLocation}</p>
      <Link href={`/shops/${shop.id}/add-product`} 
        className="border border-gray-800 rounded-md p-1 hover:bg-gray-200">
        <span className="text-md">Add Products</span>
      </Link>
      <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 mt-4">
        {
          products.map((product: any) => (
            <Link 
              key={product.id}
              href={`/shops/${id}/products/${product.id}`}
              className="border border-gray-900 p-3 rounded-md max-w-xs cursor-pointer hover:bg-gray-200">
              <h1 className="text-xl">{product.name}</h1>
              <p className="text-sm">{product.description}</p>
              <p className="text-sm">$ {product.price}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}