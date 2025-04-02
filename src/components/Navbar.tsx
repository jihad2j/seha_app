
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-medical">
              نظام صحة V4.1
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="الإجازة أو الهوية"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
              <Search 
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              />
            </form>
            <Button onClick={handleSearch} variant="default" className="bg-medical">
              بحث
            </Button>
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex space-x-2 rtl:space-x-reverse">
            <Input
              type="text"
              placeholder="الإجازة أو الهوية"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="default" className="bg-medical">
              بحث
            </Button>
          </form>
        </div>

        {/* Navigation Links - Responsive */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-6`}>
          <ul className="md:flex md:space-x-6 rtl:space-x-reverse space-y-2 md:space-y-0">
            <li>
              <Link to="/patients" className="block py-1 hover:text-medical transition-colors">
                آخر 100 ملف
              </Link>
            </li>
            <li>
              <Link to="/patients/recent" className="block py-1 hover:text-medical transition-colors">
                آخر 20 ملف
              </Link>
            </li>
            <li>
              <Link to="/patients/add" className="block py-1 hover:text-medical transition-colors">
                إدخال مريض
              </Link>
            </li>
            <li>
              <Link to="/hospitals" className="block py-1 hover:text-medical transition-colors">
                إدارة المستشفيات
              </Link>
            </li>
            <li>
              <Link to="/doctors" className="block py-1 hover:text-medical transition-colors">
                إدارة الأطباء
              </Link>
            </li>
            <li>
              <Link to="/nationalities" className="block py-1 hover:text-medical transition-colors">
                إدارة الجنسيات
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
