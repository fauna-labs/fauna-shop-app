import Image from 'next/image';
import marketIcon from "../public/market.svg";
import styles from "../styles/Nav.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="container mx-auto">
      <nav className="p-3 flex justify-between max-sm:flex-col">
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
        <div className="flex max-sm:mt-1">
          <button className="border border-gray-800 rounded-md p-2">Login</button>
        </div>
      </nav>
    </div>
  )
}