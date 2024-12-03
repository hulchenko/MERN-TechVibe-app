import { Pagination } from "@nextui-org/pagination";
import { useNavigate } from "react-router-dom";

const Paginate = ({ pages = 0, currPage = 0, isAdmin = false, keyword = "" }) => {
  const navigate = useNavigate();
  if (pages === 0) return null;

  return (
    <Pagination
      total={pages}
      initialPage={currPage}
      onChange={(page: number) => navigate(!isAdmin ? (keyword ? `/search/${keyword}/page/${page}` : `/page/${page}`) : `/admin/productlist/${page}`)}
    ></Pagination>
  );
};

export default Paginate;
