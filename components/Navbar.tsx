import { useState } from 'react';
import Image from 'next/image';
import marketIcon from "../public/market.svg";
import filterIcon from "../public/filter.svg";
import styles from "../styles/Nav.module.css";
import Link from "next/link";


export default function Navbar() {
  const [showFilter, setShowFilter] = useState(false);
  

  return (
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
          />
          <button className={styles.searchBtn}>🔍</button>
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
          <button className="border border-gray-800 rounded-md p-2 hover:bg-gray-200">Login</button>
        </div>
      </nav>

      {/* Search Filters */}
      {showFilter && (
        <div className={styles.filterContainer}>
          <div>
            <h3>Price $</h3>
            <input 
              type="number" 
              placeholder="Min $" 
              className="p-1 border border-gray-800 rounded-md mb-1 mr-1"
            />
            <input 
              type="number" 
              placeholder="Max $" 
              className="p-1 border border-gray-800 rounded-md mb-1"
            />
          </div>
          <button className="border border-gray-800 rounded-md p-2 hover:bg-gray-200" >Apply</button>
        </div>
      )}


    </div>
  )
}