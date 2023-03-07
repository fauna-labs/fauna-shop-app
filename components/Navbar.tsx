import { useState, useRef } from 'react';
import Image from 'next/image';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import marketIcon from "../public/market.svg";
import filterIcon from "../public/filter.svg";
import shopIcon from "../public/shop.svg";
import styles from "../styles/Nav.module.css";
import Link from 'next/link';
import LoginSignup from './LoginSignup';
import { useUserContext } from '../store/state';
import { useRouter } from 'next/router';


const animatedComponents = makeAnimated();

export type SearchOptions = {
  value: string;
  label: string;
}

export const categoryOptions: SearchOptions[] = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'jewelry', label: 'Jewelry' },
];

export const countryOptions: SearchOptions[] = [
  { value: 'usa', label: 'USA' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'germany', label: 'Germany' },
  { value: 'france', label: 'France' },
  { value: 'spain', label: 'Spain' },
  { value: 'italy', label: 'Italy' },
  { value: 'uk', label: 'UK' },
  { value: 'finland', label: 'Finland' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'norway', label: 'Norway' },
];

const initialStateFilters = {
  priceMin: 0,
  priceMax: 999999,
  category: [] as string[],
  deliverTo: '',
  freeDelivery: false,
  onSale: false,
  searchTerm: ''
};

export default function Navbar() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState(initialStateFilters);
  const [openLogin, setOpenLogin] = useState(false);

  const router = useRouter();

  const selectCategoryRef = useRef(null);
  const selectCountryRef = useRef(null);

  const userCtx = useUserContext() as any;
  const { user, setUser } = userCtx;


  const submitSearch = () => {
    if(searchFilters.priceMax < searchFilters.priceMin) {
      return;
    }
    router.push(`/?${new URLSearchParams(searchFilters as any).toString()}`);
  };

  const handleCountryChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      deliverTo: e?.value
    });
  };

  const handleCategoryChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      category: e?.map((item: SearchOptions) => item.value)
    });
  };

  const handleDeliveryChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      freeDelivery: e.target.checked
    });
  };

  const handleOnSaleChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      onSale: e.target.checked
    });
  }

  const handlePriceMinChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      priceMin: parseFloat(e.target.value),
    });
  }

  const handlePriceMaxChange = (e: any) => {
    setSearchFilters({
      ...searchFilters,
      priceMax: parseFloat(e.target.value)
    });
  }

  const resetFilters = () => {
    let selectedCategory = selectCategoryRef?.current as any;
    let selectedCountry = selectCountryRef?.current as any;
    selectedCategory.clearValue();
    selectedCountry.clearValue();
    setSearchFilters(initialStateFilters);
  }
  
  return (
    <>
    <div className="container mx-auto">
      <nav className={styles.navStyle}>
        <div className="flex w-3/4 max-sm:w-full">
          <Link className={styles.logo} href="/">
            <Image
              priority
              src={marketIcon}
              height={46}
              width={46}
              alt="market Icon"
              className={styles.img}
            />
            <h1 className="text-lg">Market Place</h1>
          </Link>
          <input 
            className={styles.search}
            placeholder="Search..."
            onChange={(e) => setSearchFilters({
              ...searchFilters,
              searchTerm: e.target.value.toLowerCase()
            })}
          />
          <button 
            className={styles.searchBtn}
            onClick={submitSearch}
          >
            🔍
          </button>
        </div>
        <div className={styles.btnWraps}>
          <button 
            className="border border-gray-800 rounded-md p-2 mr-3 hover:bg-gray-200"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Image
              priority
              src={filterIcon}
              height={20}
              width={20}
              alt="market Icon"
            />
          </button>
          {
            user?.data ? (
              <>
                <Link href="/myshops" className={styles.shopBtn}>
                  <Image
                    priority
                    src={shopIcon}
                    height={30}
                    width={30}
                    alt="market Icon"
                  /> 
                </Link>
                <button 
                  className="border border-pink-200 rounded-md p-2 hover:bg-red-200"
                  onClick={() => {
                    window.localStorage.removeItem('fauna-marketplace');
                    setUser(null);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                className="border border-gray-800 rounded-md p-2 hover:bg-gray-200"
                onClick={() => {
                  setShowFilter(false);
                  setOpenLogin(true);
                }}
              >
                Login
              </button>
            )
          }
        </div>
      </nav>

      {/* Search Filters */}
      {showFilter && (
        <>
        <div className={styles.filterContainer}>
          <div>
            <h3>Price $</h3>
            <input 
              type="number" 
              placeholder="Min $" 
              className="p-1 border border-gray-800 rounded-md mb-1 mr-1"
              onChange={handlePriceMinChange}
              value={searchFilters.priceMin}
            />
            <input 
              type="number" 
              placeholder="Max $" 
              className={
                `p-1 border border-gray-800 rounded-md mb-1 mr-1 ${
                  searchFilters.priceMax < searchFilters.priceMin && 
                  'focus:outline-none focus:border-red-500'
                }`
              }
              onChange={handlePriceMaxChange}
              value={searchFilters.priceMax}
            />
          </div>
          <div className="mr-2 mb-2 w-full">
            <h3>Category</h3>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={categoryOptions}
              onChange={handleCategoryChange}
              ref={selectCategoryRef}
            />
          </div>
          <div className="mr-2 mb-2 w-full">
            <h3>Deliver to</h3>
            <Select
              closeMenuOnSelect={true}
              isSearchable={true}
              components={animatedComponents}
              options={countryOptions}
              onChange={handleCountryChange}
              ref={selectCountryRef}
            />
          </div>
          <div className="flex flex-col w-2/4 justify-center pb-2">
            <div>
              <input 
                type="checkbox" 
                className="p-1"
                onChange={handleDeliveryChange}
                checked={searchFilters.freeDelivery ? true : false}
              />
              <span className="ml-1">Free Delivery</span>
            </div>
            <div>
              <input 
                type="checkbox" 
                className="p-1"
                onChange={handleOnSaleChange}
                checked={searchFilters.onSale ? true : false}
              />
              <span className="ml-1">On Sale</span>
            </div>
          </div>
        </div>
        <button 
          className="ml-2 mb-1 border border-gray-800 rounded-md p-2 hover:bg-gray-200"
          onClick={resetFilters}
        >
            Clear Filters
        </button>
        </>
      )}
    </div>
    {
        openLogin && (
          <LoginSignup onClose={() => setOpenLogin(false)}/>
        )
    }
    </>
  )
}