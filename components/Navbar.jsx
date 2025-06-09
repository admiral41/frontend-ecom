"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { menuData } from "@/data/menuData";
import { getNavData } from "@/api/api";


const Navbar = () => {
  const { isSeller, router } = useAppContext();

  const [navData, setNavData] = useState([]);
  useEffect(() => {
    getAllNavData();
  }, []);

  const getAllNavData = async () => {
    try {
      const res = await getNavData();
      console.log("Res is ", res.data.data)
      setNavData(res.data.data)
    } catch (error) {

    }
  }


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenuIndex, setExpandedMenuIndex] = useState(null);
  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState(null);


  const toggleExpandedMenu = (index) => {
    if (expandedMenuIndex === index) {
      setExpandedMenuIndex(null);
      setExpandedCategoryIndex(null);
    } else {
      setExpandedMenuIndex(index);
      setExpandedCategoryIndex(null);
    }
  };


  const toggleExpandedCategory = (index) => {
    if (expandedCategoryIndex === index) {
      setExpandedCategoryIndex(null);
    } else {
      setExpandedCategoryIndex(index);
    }
  };


  return (
    <nav className="flex items-center mb-4 justify-between px-6 md:px-16 lg:px-32 border-b border-gray-300 text-gray-700 sticky top-0 z-50 bg-white">
      {/* Logo */}
      <Image
        className="cursor-pointer w-32 md:w-30"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Menu */}
      <div className="flex items-center gap-10 max-md:hidden">
        {navData.map((menu) => (
          <div key={menu.title} className="relative group">
            <button className="hover:text-black text-lg transition">
              {menu.title}
            </button>

            {/* Dropdown (Desktop) */}
            <div className="absolute hidden group-hover:grid grid-cols-3 bg-white shadow-2xl p-6 rounded-lg z-50 top-3 left-1/2 -translate-x-1/2 gap-12 border mt-4 w-[800px]">
              {menu.categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-gray-900 font-semibold text-lg mb-3">
                    {category.name}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/${menu.title.toLowerCase()}/${category.name.toLowerCase()}/${sub
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="hover:underline hover:text-black transition"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      {/* Desktop Right Icons */}
      <ul className="hidden md:flex items-center gap-6">
        <Image
          className="w-5 h-5 cursor-pointer"
          src={assets.search_icon}
          alt="search icon"
        />
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        <button className="flex items-center gap-2 hover:text-gray-900 transition text-sm font-medium">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </ul>

      {/* Mobile menu toggle button */}
      <button
        className="md:hidden flex flex-col gap-1 cursor-pointer"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
        />
        <span
          className={`block h-0.5 w-6 bg-gray-700 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
        />
        <span
          className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
        />
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-300 shadow-md md:hidden z-40 overflow-hidden">
          <ul className="flex flex-col p-4 space-y-4">
            {navData.map((menu, menuIndex) => (
              <li key={menu.title}>
                {/* Menu Title */}
                <button
                  onClick={() => toggleExpandedMenu(menuIndex)}
                  className="flex justify-between items-center w-full text-lg font-medium text-gray-700 hover:text-black transition"
                >
                  {menu.title}
                  <span className="ml-2">
                    {expandedMenuIndex === menuIndex ? "▲" : "▼"}
                  </span>
                </button>

                {/* Categories - show only if menu is expanded with animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenuIndex === menuIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <ul className="mt-2 pl-4 border-l border-gray-300 space-y-2">
                    {menu.categories.map((category, catIndex) => (
                      <li key={category.name}>
                        {/* Category title */}
                        <button
                          onClick={() => toggleExpandedCategory(catIndex)}
                          className="flex justify-between items-center w-full text-md font-medium text-gray-600 hover:text-black transition"
                        >
                          {category.name}
                          <span>
                            {expandedCategoryIndex === catIndex ? "▲" : "▼"}
                          </span>
                        </button>

                        {/* Subcategories - show only if category expanded with animation */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategoryIndex === catIndex ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <ul className="mt-1 pl-4 space-y-1 text-sm text-gray-700">
                            {category.subcategories.map((sub) => (
                              <li key={sub}>
                                <Link
                                  href={`/${menu.title.toLowerCase()}/${category.name.toLowerCase()}/${sub
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                  className="block hover:underline hover:text-black transition"
                                  onClick={() => setMobileMenuOpen(false)} // Close mobile menu on subcategory click
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;