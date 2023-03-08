import { useRouter } from "next/router";
import { useUserContext } from "../store/state";

export default function Cart() {
  const userCtx = useUserContext() as any;
  const router = useRouter();
  const { cart, setCart } = userCtx;

  const itemPurchased = (item: any) => {
    alert('Item purchased');
    setCart([]);
    router.push('/');
  }
  if(cart.length == 0) return (
    <div className="p-2 container mx-auto">
      <h1 className="p-2 text-xl">Nothing in the cart</h1>
    </div>
  )

  return (
    <div className="p-2 container mx-auto">
      <h1 className="p-2 text-xl">Cart</h1>
      {cart?.map((item: any) => (
          <div className="flex p-2 mb-2" key={item.id}>
            <img src={item.img} alt={item.name} className="w-32 h-44" />
            <div className="ml-2">
              <h3>{item.name}</h3>
              <p>{item.price}</p>
            </div>
          </div>
      ))}
      <hr />
      <div className="flex justify-end">
        <h3>Total: $ {
          cart?.reduce((acc: any, item: any) => acc + item.price, 0).toFixed(2)}</h3>
      </div>
      <div className="flex flex-col justify-end">
        <button 
          className="border-2 border-gray-800 rounded-md p-1 bg-purple-200 ml-2"
          onClick={itemPurchased}
        >
          <span className="text-md">Checkout</span>
        </button>
      </div>
    </div>
  )
}