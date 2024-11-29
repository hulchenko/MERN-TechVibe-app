import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const Paginate = ({ pages = 0, currPage = 0, isAdmin = false, keyword = "" }) => {
  if (pages > 1) return null;

  return (
    <Pagination>
      {Array(pages)
        .fill(0)
        .map((_, idx) => (
          <Pagination.Item
            active={idx + 1 === currPage}
            as={Link}
            key={idx + 1}
            to={!isAdmin ? (keyword ? `/search/${keyword}/page/${idx + 1}` : `/page/${idx + 1}`) : `/admin/productList/${idx + 1}`}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
    </Pagination>
  );
};

export default Paginate;
