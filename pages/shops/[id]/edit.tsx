import { Client } from "fauna";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { countryOptions } from "../../../components/Navbar";
import { useUserContext } from "../../../store/state";

export default function EditShop() {

  const userCtx = useUserContext() as any;
  const { user } = userCtx;

  const selectRef = useRef<any>(null);

  const router = useRouter();

  const client = new Client({ 
    endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
    secret: user?.data ? user.data.secret : process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
  });

  const [state, setState] = useState({
    name: '',
    description: '',
    countryLocation: '',
  });

  useEffect(() => {
    getShop();
  }, []);

  const getShop = async () => {
    try {
      const response = await client.query({
        query: `Shop.byId("${router.query.id}")`
      })
      const countryIndex = countryOptions.findIndex(option => option.value == response.data.countryLocation)
      selectRef.current?.setValue(countryOptions[countryIndex]);
      setState({...response.data, countryIndex });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  };


  if(!user?.data) {
    return (
      <div className="p-2 container mx-auto">
        <span>Please Login to create shops</span>
      </div>
    )
  }

  const handleCountryChange = (e: any) => {
    setState({
      ...state,
      countryLocation: e?.value
    });
  };

  const updateShop = async (e: any) => {
    e.preventDefault();
    try {
      const response = await client.query({
        query: `Shop.byId("${router.query.id}").update({
          name: "${state.name}",
          description: "${state.description}",
          countryLocation: "${state.countryLocation}",
        })`
      })
      alert("Shop updated successfully!");
      router.push('/myshops');
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  }

  
  return (
    <div className="p-2 container mx-auto">
      <h1 className="text-lg">Edit Shop</h1>
      <form className="p-2 flex flex-col" onSubmit={updateShop}>
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
            options={countryOptions}
            onChange={handleCountryChange}
            ref={selectRef}
          />
        </div>
        <button 
          className="p-2 mt-2 max-w-xs rounded-md border border-gray-800 hover:bg-gray-200"
          type="submit"
        >
          Update Shop
        </button>
      </form>
    </div>
  )
}