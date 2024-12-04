import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { ProductInterface } from "../../interfaces/product.interface";
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";
import genres from "../../assets/data/genres.json";
import { Card, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Textarea } from "@nextui-org/react";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState<ProductInterface>({
    productId: "",
    name: "",
    price: "",
    image: "/images/no-image.png", // default
    genre: "",
    countInStock: 1,
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
  }, [initProduct, productId]);

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
      <Button color="primary" variant="bordered" onClick={() => navigate("/admin/productlist")}>
        Back
      </Button>
      <Card>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        <form onSubmit={submitHandler}>
          <Input
            type="text"
            label="Name"
            labelPlacement={"outside"}
            placeholder="Enter name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <Input
            type="number"
            label="Price"
            labelPlacement={"outside"}
            placeholder="Enter price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          <Input type="file" label="Image" labelPlacement={"outside"} placeholder="Upload image" onChange={uploadFileHandler} color="primary" />
          <Dropdown as="select">
            <DropdownTrigger>
              <Button variant="bordered">Select genre</Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => setProduct({ ...product, genre: String(key) })}>
              {/* TODO string key? */}
              {genres.map((genre, idx) => (
                <DropdownItem key={genre} value={genre}>
                  {genre}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Input
            type="number"
            label="Count In Stock"
            labelPlacement={"outside"}
            placeholder="Enter stock qty"
            min={1}
            max={99}
            value={String(product.countInStock)}
            onChange={(e) => setProduct({ ...product, countInStock: Number(e.target.value) })}
          />
          <h2>Description</h2>
          <Textarea
            label="Description"
            placeholder="Enter description"
            className="max-w-xs"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <Button type="submit" color="primary" variant="solid">
            Update
          </Button>
        </form>
      </Card>
    </>
  );
};

export default ProductEditScreen;
