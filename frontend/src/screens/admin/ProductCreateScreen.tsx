import React, { useState } from "react";
import FormContainer from "../../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import genres from "./../../assets/data/genres.json";
import { ProductInterface } from "../../interfaces/product.interface";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { apiErrorHandler } from "../../utils/errorUtils";
import Loader from "../../components/Loader";
import { APIError } from "../../types/api-error.type";

const ProductCreateScreen = () => {
  // validate the form fields

  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductInterface>({
    name: "",
    price: "",
    image: "",
    genre: "",
    countInStock: 1,
    description: "",
  });
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createProduct(product);
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
    console.log(`form data before: `, formData);
    formData.append("image", fileToUpload);
    console.log(`form data after: `, formData);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setProduct({ ...product, image: res.image });
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Link to={"/admin/productlist"} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>New Product</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
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
            <Form.Select required value={product.genre} onChange={(e) => setProduct({ ...product, genre: e.target.value })}>
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
              required
              type="number"
              placeholder="Enter count in stock"
              min={1}
              max={99}
              value={product.countInStock}
              onChange={(e) => setProduct({ ...product, countInStock: Number(e.target.value) })}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              type="text"
              as="textarea"
              placeholder="Enter description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Save
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
