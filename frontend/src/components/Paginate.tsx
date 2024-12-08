import { Pagination } from "@nextui-org/pagination";
import { useLocation, useNavigate } from "react-router-dom";

const Paginate = ({ pages = 0, currPage = 0, search = "" }) => {
  if (pages === 0) return null;

  const navigate = useNavigate();
  const { pathname: currPath } = useLocation();

  return (
    <Pagination
      total={pages}
      initialPage={currPage}
      className="relative z-50"
      onChange={(page: number) => navigate(search ? `${currPath}?search=${search}&page=${page}` : `${currPath}?page=${page}`)}
    ></Pagination>
  );
};

export default Paginate;
