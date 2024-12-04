import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SearchIcon } from "../icons/SearchIcon";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  useEffect(() => {
    const search = () => {
      if (keyword.length > 0) {
        navigate(`/search/${keyword.trim()}`);
      } else {
        navigate("/");
      }
    };

    const timer = setTimeout(() => search(), 1500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const stringValidate = (str: string) => {
    return /[a-zA-Z]/.test(str); // Alphabetic only
  };

  return (
    <Input
      labelPlacement={"outside"}
      placeholder="Search..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
      type="search"
    />
  );
};

export default SearchBox;
