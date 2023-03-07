import { Client } from "@fauna/fauna";
import { useRouter } from "next/router";
import { useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { categoryOptions } from "../../../components/Navbar";
import { useUserContext } from "../../../store/state";



const animatedComponents = makeAnimated();

export default function AddProduct() {

  const userCtx = useUserContext() as any;
  const { user } = userCtx;
  const router = useRouter();

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user?.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });

  const [state, setState] = useState({
    name: '',
    description: '',
    price: '',
    img: '',
    category: []
  });

  const createNewProduct = async (e: any) => {
    e.preventDefault();
    console.log('state', state);
    try {
      const response = await client.query({
        query: `Product.create({
          name: "${state.name}",
          description: "${state.description}",
          price: ${state.price},
          img: "${state.img}",
          category: ${JSON.stringify(state.category)},
          shop: Shop.byId("${router.query.id}")
        })`
      })
      alert("Product created successfully!");
      router.push(`/shops/${router.query.id}`);
      console.log('response', response);
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

  const handleCategoryChange = (e: any) => {
    setState({
      ...state,
      category: e?.map((item: any) => item.value)
    });
  };

  return (
    <div className="p-2 container mx-auto">
      <h1 className="p-2 text-xl">Add new product</h1>
      <form className="p-2 flex flex-col" onSubmit={createNewProduct}>
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
            components={animatedComponents}
            isMulti
            options={categoryOptions}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="flex flex-col max-w-xs">
          <label htmlFor="name">Product Image</label>
          <input onChange={handleChange} value={state.img} name="img" className="p-1 border border-gray-800 rounded-md" />
        </div>

        <button 
          className="p-1 max-w-xs mt-2 border border-gray-800 rounded-md hover:bg-gray-200"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}