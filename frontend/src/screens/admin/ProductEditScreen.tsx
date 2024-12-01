import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { ProductInterface } from "../../interfaces/product.interface";
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";
import genres from "../../assets/data/genres.json";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState<ProductInterface>({
    productId: "",
    name: "",
    price: "",
    image: "",
    genre: "",
    countInStock: 0,
    description: "",
  });
  const { data: initProduct, isLoading, error: getProductError } = useGetProductDetailsQuery(productId || "");
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (initProduct) {
      setProduct({
        productId,
        name: initProduct.name,
        price: initProduct.price,
        image: initProduct.image,
        genre: initProduct.genre,
        countInStock: initProduct.countInStock,
        description: initProduct.description,
      });
    }
  }, [initProduct]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProduct(product);
    if (result.error) {
      toast.error((result.error as APIError).data.message);
    } else {
      toast.success("Product updated");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const formData = new FormData();
    const fileToUpload = files ? files[0] : "";
    formData.append("image", fileToUpload);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setProduct({ ...product, image: res.image });
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;
  if (getProductError) return <Message variant="danger">{getProductError}</Message>;

  return (
    <>
      <Link to={"/admin/productlist"} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="image" className="my-2">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler}></Form.Control>
          </Form.Group>
          <Form.Group controlId="genre" className="my-2">
            <Form.Label>Genre</Form.Label>
            <Form.Select value={product.genre} onChange={(e) => setProduct({ ...product, genre: e.target.value })}>
              <option disabled value="">
                Select genre
              </option>
              {genres.map((genre, idx) => (
                <option key={idx} value={genre}>
                  {genre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count in stock"
              value={product.countInStock}
              onChange={(e) => setProduct({ ...product, countInStock: Number(e.target.value) })}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              placeholder="Enter description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
