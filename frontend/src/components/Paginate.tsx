import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Paginate = ({ pages = 0, currPage = 0, isAdmin = false, keyword = "" }) => {
  const navigate = useNavigate();
  if (pages === 0) return null;

  return (
    <Pagination>
      {Array(pages)
        .fill(0)
        .map((_, idx) => (
          <Pagination.Item
            active={idx + 1 === currPage}
            key={idx + 1}
            onClick={() => navigate(!isAdmin ? (keyword ? `/search/${keyword}/page/${idx + 1}` : `/page/${idx + 1}`) : `/admin/productlist/${idx + 1}`)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
    </Pagination>
  );
};

export default Paginate;
