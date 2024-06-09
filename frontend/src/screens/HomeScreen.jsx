import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const { pageNum, keyword } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNum });

    return (
        <>  {!keyword ? <ProductCarousel /> : (
            <Link to='/' className='btn btn-light mb-4'>Go Back</Link>
        )}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (<>
                <h1>Latest Products</h1 >
                <Row>
                    {data.products.map((product) => (
                        <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
                <Paginate pages={data.pages} currPage={data.page} keyword={keyword} />
            </>
            )}

        </>
    );
};

export default HomeScreen;