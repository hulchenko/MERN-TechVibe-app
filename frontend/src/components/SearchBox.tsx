import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (stringValidate(keyword)) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  const stringValidate = (str = "") => {
    return /^[a-zA-Z]+$/.test(str); // Alphabetic only
  };

  return (
    <form onSubmit={submitHandler} className="d-flex">
      <Input type="text" labelPlacement={"outside"} placeholder="Search Products..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button type="submit" className="p-2 mx-2">
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
