import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon } from "../icons/SearchIcon";

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const callSearch = () => {
      if (search.length > 0) {
        navigate(`/?search=${search.trim()}`);
      } else {
        navigate("/");
      }
    };

    const timer = setTimeout(() => callSearch(), 1500);
    return () => clearTimeout(timer);
  }, [search]);

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
