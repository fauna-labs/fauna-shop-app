import { Client } from "@fauna/fauna";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { categoryOptions } from "../../../../components/Navbar";

import { useUserContext } from "../../../../store/state";

export default function ProductPage() {
  const [product, setProduct] = useState({} as any);
  const [state, setState] = useState({} as any);
  const [edit, setEdit] = useState(false);
  const router = useRouter();

  const userCtx = useUserContext() as any;
  const { user } = userCtx;

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user?.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });

  useEffect(() => {
    getProduct();
  }, [])

  const getProduct = async () => {
    try {
      const response = await client.query({
        query: `Product.byId("${router.query.pid}")`
      })
      console.log('Product :-', response);
      setProduct(response.data);
      setState(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const deleteProduct = async () => {
    try {
      await client.query({
        query: `Product.byId("${router.query.pid}").delete()`
      })
      alert("Product deleted successfully!");
      router.push(`/shops/${router.query.id}`);
    } catch (error) {
      console.log('error', error);
    }
  }

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  };

  const editProduct = async (e: any) => {
    e.preventDefault();
    try {
      await client.query({
        query: `Product.byId("${router.query.pid}").update({
          name: "${state.name}",
          description: "${state.description}",
          price: ${state.price},
          img: "${state.img}",
          category: ${JSON.stringify(state.category)}
        })`
      })
      alert("Product updated successfully!");
      setEdit(false);
      getProduct();
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleCategoryChange = (e: any) => {
    setState({
      ...state,
      category: e?.map((item: any) => item.value)
    });
  };

  
  return (
    <div className="p-2 container mx-auto">
      <h1 className=" text-xl">{product.name}</h1>
      <p className=" text-md">{product.description}</p>
      <p className=" text-md">{product.price}</p>
      <div>
        <button 
          className="border border-gray-800 rounded-md p-1 hover:bg-gray-200"
          onClick={() => setEdit(!edit)}
        >
            <span className="text-md">Edit</span>
        </button>
        <button 
          className="border border-red-800 rounded-md p-1 ml-2 hover:bg-red-200"
          onClick={deleteProduct}
        >
            <span className="text-md">Delete</span>
        </button>
      </div>

      {edit && (
        <div className="mt-4">
          <h1 className=" text-xl">Edit Product</h1>

          <form className="p-2 flex flex-col" onSubmit={editProduct}>
            <div className="flex flex-col max-w-xs">
              <label htmlFor="name">Product Name</label>
              <input 
                onChange={handleChange} 
                value={state.name} 
                name="name"
                className="p-1 border border-gray-800 rounded-md" 
              />
            </div>
            <div className="flex flex-col max-w-xs">
              <label htmlFor="description">Product Description</label>
              <textarea 
                onChange={handleChange} 
                value={state.description} 
                name="description"
                className="p-1 border border-gray-800 rounded-md" 
              />
            </div>
            <div className="flex flex-col max-w-xs">
              <label htmlFor="price">Product Price</label>
              <input 
                type="number" 
                name="price"
                onChange={handleChange} 
                value={state.price} 
                className="p-1 border border-gray-800 rounded-md" 
              />
            </div>

            <div className="flex flex-col max-w-xs">
              <label htmlFor="category">Category</label>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={categoryOptions}
                onChange={handleCategoryChange}
                defaultValue={state.category?.map((item: any) => ({ value: item, label: item }))}
              />
            </div>

            <div className="flex flex-col max-w-xs">
              <label htmlFor="name">Product Image</label>
              <input onChange={handleChange} value={state.img} name="img" className="p-1 border border-gray-800 rounded-md" />
            </div>

            <button 
              className="p-1 max-w-xs mt-2 border border-gray-800 rounded-md hover:bg-gray-200"
            >
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  )
}