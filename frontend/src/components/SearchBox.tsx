import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon } from "../icons/SearchIcon";

const SearchBox = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const callSearch = () => {
      if (search.length > 0) {
        const keyword = search.trim();
        navigate(`/?search=${keyword}`);
      }
    };

    const timer = setTimeout(() => callSearch(), 1500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!location.search) {
      setSearch(""); // clear input field on route change
    }
  }, [location]);

  return (
    <Input
      color="primary"
      variant="bordered"
      labelPlacement={"outside"}
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
      type="search"
    />
  );
};

export default SearchBox;
