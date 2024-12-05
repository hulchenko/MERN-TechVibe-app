import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Divider,
  Textarea,
  CardHeader,
  CardFooter,
  CardBody,
} from "@nextui-org/react";
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

const ratingOptions = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState<null | number>(null);
  const [selectedRating, setSelectedRating] = useState("Rating");
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
    if (!rating || !comment) {
      toast.error("Both field are required");
      return;
    }
    try {
      const response = await createReview({
        productId,
        rating: rating || 0,
        comment,
      }).unwrap(); // unwraps {data: {message: ""}} -> {message: ""}

      refetch();
      toast.success(response?.message || "Review submitted");
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

      <div className="flex gap-4 justify-between h-96 mt-6">
        <div className="flex-col h-full w-full">
          <Image src={product.image} alt={product.name} height="40rem" />
          <Rating value={product.rating || 0} text={`${product.numReviews} review(s)`} />
          <Divider className="mt-6" />
          <h2 className="my-6 font-bold">Write a customer review</h2>
          {loadingReview && <Loader />}
          {userInfo ? (
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button color="primary" variant="faded" className="capitalize">
                    {selectedRating}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => setSelectedRating(String(key))}>
                  {ratingOptions.map((key, idx) => (
                    <DropdownItem value={idx + 1} key={key} onClick={(e) => setRating(e.currentTarget.value)}>
                      {key}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Textarea required label="Comment" placeholder="Add a comment" className="w-full" onChange={(e) => setComment(e.target.value)} />
              <Button isDisabled={loadingReview} type="submit" color="primary" className="max-w-6">
                Submit
              </Button>
            </form>
          ) : (
            <Message>
              Please{" "}
              <Link to="/login" className="text-violet-500">
                sign in
              </Link>{" "}
              to write a review
            </Message>
          )}
        </div>

        <div className="w-full">
          <h2 className="my-6 font-bold">Description</h2>
          <Card className="flex gap-2">
            <CardBody>
              <p>{product.description}</p>
            </CardBody>
          </Card>
          <Divider className="mt-6" />
          <h2 className="my-6 font-bold">Customer comments</h2>
          <div className="h-full overflow-auto">
            {product?.reviews?.length === 0 && <Message>No Comments</Message>}
            {product.reviews &&
              product.reviews.map((review: ReviewInterface) => (
                <Card key={review._id} className="mt-4">
                  <CardHeader>
                    <h2 className="font-bold">{review.name}</h2>
                  </CardHeader>
                  <CardBody>
                    <Rating value={review.rating} text={""} />
                    <p>{review?.createdAt?.substring(0, 10)}</p>
                  </CardBody>
                  <CardFooter>
                    <p>{review.comment}</p>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Card className="h-60 w-1/2">
            <CardHeader className="flex justify-between">
              <h2>Price</h2>
              <p className="font-bold">${product.price}</p>
            </CardHeader>
            <CardBody className="flex-col">
              <div className="flex justify-between">
                <h2>Status</h2>
                <p className="font-bold">{product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</p>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between">
                <h2>Qty</h2>
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
              </div>
            </CardBody>
            <CardFooter className="flex-col">
              <Button className="btn-block" variant="bordered" color="primary" type="button" isDisabled={product.countInStock === 0} onClick={addToCartHandler}>
                Add To Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
