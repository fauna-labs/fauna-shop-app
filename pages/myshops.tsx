import { Client } from '@fauna/fauna';
import { useEffect } from 'react';
import { useUserContext } from "../store/state";


export default function MyShopsPage() {
  const userCtx = useUserContext() as any;
  const { user } = userCtx;

  console.log('user ==> MyShops', user);
  
  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user ? user.data.secret : '' 
  });

  useEffect(() => {
    fetchShops();
  }, [user?.data])

  const fetchShops = async () => {
    try {
      const response = await client.query({
        query: `Shop.all.where("${user?.data.email}")`
      })
      console.log('response', response);
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
      <h1 className="p-2 text-xl">Mange Your Shop(s)</h1>
      <div className="p-2 grid grid-cols-4 gap-4 max-sm:grid-cols-2">
        <div className="border border-gray-900 p-3 rounded-md max-w-xs">01</div>
        <div className="border border-gray-900 p-3 rounded-md max-w-xs">01</div>
        <div className="border border-gray-900 p-3 rounded-md max-w-xs">01</div>
      </div>
    </div>
  )
}