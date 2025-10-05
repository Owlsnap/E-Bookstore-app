import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineHeart } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import { getImgUrl } from "../utils/getImgUrl";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const cartItems = useSelector((state) => state.cart.cartItems);
  const {currentUser, logout} = useAuth();
  const { data: books = [] } = useFetchAllBooksQuery();
  
  const handleLogout = () => {
    logout()
  }

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Filter books based on title, category, or description
    const filteredBooks = books.filter(book => 
      book.title?.toLowerCase().includes(query.toLowerCase()) ||
      book.category?.toLowerCase().includes(query.toLowerCase()) ||
      book.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    setSearchResults(filteredBooks);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (bookId) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigate(`/books/${bookId}`);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft className="size-6" />
          </Link>

          {/* search input */}
          <div className="relative sm:w-72 w-40 space-x-2" ref={searchRef}>
            <IoIosSearch className="absolute inline-block left-3 inset-y-2" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 border">
                {searchResults.map((book) => (
                  <div
                    key={book._id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
                    onClick={() => handleSearchResultClick(book._id)}
                  >
                    <img
                      src={getImgUrl(book.coverImage)}
                      alt={book.title}
                      className="w-10 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = getImgUrl('book-1.png'); // Fallback to a default book image
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {book.category}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        ${book.newPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 border">
                <div className="px-4 py-3 text-gray-500 text-center">
                  No books found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
        {/* right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
            {currentUser ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    alt="avatar"
                    className={`size-7 rounded-full 
                ${currentUser ? "ring-2 ring-blue-500" : ""}`}
                  />
                </button>
                {/* show dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((navItem) => (
                        <li
                          key={navItem.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={navItem.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {navItem.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button 
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">Logout</button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to={"/login"}>
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>
          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>
          <Link
            to={"/cart"}
            className="bg-primary p-1 sm:px-6 py-2 flex items-center rounded-md"
          >
            <HiOutlineShoppingCart className="size-6" />
            {cartItems.length > 0 ? (
              <span className="text-sm font-semibold sm:ml-1">
                {cartItems.length}
              </span>
            ) : (
              <span className="text-sm font-semibold sm:ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
