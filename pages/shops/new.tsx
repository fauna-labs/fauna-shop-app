import { useState } from "react";
import Select from 'react-select';
import { countryOptions } from "../../components/Navbar";
import makeAnimated from 'react-select/animated';
import { useUserContext } from "../../store/state";
import { Client } from 'fauna';
import { useRouter } from "next/router";



export default function NewShop() {

  const userCtx = useUserContext() as any;
  const { user } = userCtx;
  const router = useRouter();

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user?.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });
  
  const animatedComponents = makeAnimated();
  
  const [state, setState] = useState({
    name: '',
    description: '',
    countryLocation: '',
  });

  const createNewShop = async (e: any) => {
    e.preventDefault();
    console.log('state', state);
    try {
      const response = await client.query({
        query: `Shop.create({
          name: "${state.name}",
          description: "${state.description}",
          countryLocation: "${state.countryLocation}",
          owner: User.byId("${user.data.document.id}")
        })`
      })
      alert("Shop created successfully!");
      router.push('/myshops');
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

  const handleCountryChange = (e: any) => {
    setState({
      ...state,
      countryLocation: e?.value
    });
  };

  if(!user?.data) {
    return (
      <div className="p-2 container mx-auto">
        <span>Please Login to create shops</span>
      </div>
    )
  }
  
  return (
    <div className="p-2 container mx-auto">
      <h1 className="p-2 text-xl">Create New Shop</h1>
      <form className="p-2 flex flex-col" onSubmit={createNewShop}>
        <div className="flex flex-col max-w-xs">
          <label htmlFor="name">Shop Name</label>
          <input 
            name="name" 
            onChange={handleChange} 
            value={state.name} 
            className="p-1 border border-gray-800 rounded-md"
          />
        </div>
        <div className="flex flex-col max-w-xs">
          <label htmlFor="name">Description</label>
          <textarea 
            name="description" 
            onChange={handleChange} 
            value={state.description} 
            className="p-1 border border-gray-800 rounded-md"
          />
        </div>
        <div className="flex flex-col max-w-xs">
          <label htmlFor="name">Location</label>
          <Select
            closeMenuOnSelect={true}
            isSearchable={true}
            components={animatedComponents}
            options={countryOptions}
            onChange={handleCountryChange}
          />
        </div>
        <button 
          className="p-2 mt-2 max-w-xs rounded-md border border-gray-800 hover:bg-gray-200"
          type="submit"
        >
          Create Shop
        </button>
      </form>
    </div>
  )
}
