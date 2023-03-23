import { Client } from 'fauna';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUserContext } from "../store/state";


export default function MyShopsPage() {
  const userCtx = useUserContext() as any;
  const { user } = userCtx;

  const [shops, setShops] = useState([]);
  
  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any, 
  });

  useEffect(() => {
    fetchShops();
  }, [user?.data])

  const fetchShops = async () => {
    try {
      const response = await client.query({
        query: `
          let user = User.byId("${user.data.document.id}")
          Shop.all().where(.owner == user)
        `
      })
      console.log('response: ==>', response);
      setShops(response.data?.data);
    } catch (error) {
      console.log('error', error);
    }
  }
  
  if(!user?.data) {
    return (
      <div className="p-2 container mx-auto">
        <span>Please Login to manage your shops</span>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex mt-2 mb-2">
        <h1 className="p-2 text-xl">Mange Your Shop(s)</h1>
        <Link 
          href="/shops/new" 
          className="p-2 border border-gray-900 rounded-md max-w-sm cursor-pointer hover:bg-gray-200"
        >
          <span className="text-md">Create a Shop</span>
        </Link>
      </div>
      <div className="p-2 grid grid-cols-4 gap-4 max-sm:grid-cols-2">
        {
          shops.map((shop: any) => (
            <Link 
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="border border-gray-900 p-3 rounded-md max-w-xs cursor-pointer hover:bg-gray-200">
              <h1 className="text-xl">{shop.name}</h1>
              <p className="text-sm">{shop.description}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}