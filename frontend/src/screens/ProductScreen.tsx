import { useState } from "react";
import { Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Divider, Textarea } from "@nextui-org/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ReviewInterface } from "../interfaces/review.interface";
import { addToCart } from "../slices/cartSlice";
import { useCreateReviewMutation, useGetProductDetailsQuery } from "../slices/productsApiSlice";
import { APIError } from "../types/api-error.type";
import { apiErrorHandler } from "../utils/errorUtils";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId || "");
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty })); //dispatch() is to use addCart middleware and intercept/handle async operations
    navigate("/cart");
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating: rating || 0,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;
  if (!product) return <p>Product not found</p>;

  return (
    <>
      <Button color="primary" variant="bordered" onClick={() => navigate("/")}>
        Back
      </Button>

      <Card>
        <Image src={product.image} alt={product.name} />
        <Rating value={product.rating || 0} text={`${product.numReviews} reviews`} />
        <Input isReadOnly label="Price" variant="bordered" defaultValue={`$${product.price}`} className="max-w-xs" />
        <Input isReadOnly label="Description" variant="bordered" defaultValue={product.description} className="max-w-xs" />
      </Card>
      <Card>
        <Input isReadOnly label="Price" variant="bordered" defaultValue={`$${product.price}`} className="max-w-xs" />
        <Input isReadOnly label="Status" variant="bordered" defaultValue={product.countInStock > 0 ? "In Stock" : "Out Of Stock"} className="max-w-xs" />
        <Input isReadOnly label="Qty" variant="bordered" defaultValue={product.countInStock > 0 ? "In Stock" : "Out Of Stock"} className="max-w-xs" />

        <Dropdown as="select">
          <DropdownTrigger>
            <Button variant="faded">{qty}</Button>
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => setQty(Number(key))}>
            {Array(product.countInStock > 10 ? 10 : product.countInStock)
              .fill(0)
              .map((_, idx) => (
                <DropdownItem key={idx + 1} value={idx + 1}>
                  {idx + 1}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>

        <Button className="btn-block" variant="bordered" color="primary" type="button" isDisabled={product.countInStock === 0} onClick={addToCartHandler}>
          Add To Cart
        </Button>
      </Card>
      <Card>
        <h2>Reviews</h2>
        {product?.reviews?.length === 0 && <Message>No Reviews</Message>}

        {product.reviews &&
          product.reviews.map((review: ReviewInterface) => (
            <Card key={review._id}>
              <strong>{review.name}</strong>
              <Rating value={review.rating} text={""} />
              <p>{review?.createdAt?.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </Card>
          ))}
        <Divider />
        <h2>Write a Customer Review</h2>

        {loadingReview && <Loader />}

        {userInfo ? (
          <form onSubmit={submitHandler}>
            <h2>Rating</h2>
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" variant="faded">
                  {rating || "Select"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => setRating(Number(key))}>
                <DropdownItem value="1">Poor</DropdownItem>
                <DropdownItem value="2">Fair</DropdownItem>
                <DropdownItem value="3">Good</DropdownItem>
                <DropdownItem value="4">Very Good</DropdownItem>
                <DropdownItem value="5">Excellent</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <h2>Comment</h2>
            <Textarea label="Comment" placeholder="Add a comment" className="max-w-xs" onChange={(e) => setComment(e.target.value)} />

            <Button isDisabled={loadingReview} type="submit" color="primary">
              Submit
            </Button>
          </form>
        ) : (
          <Message>
            Please <Link to="/login">sign in</Link> to write a review
          </Message>
        )}
      </Card>
    </>
  );
};

export default ProductScreen;
