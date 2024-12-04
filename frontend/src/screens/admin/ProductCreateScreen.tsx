import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Link, useNavigate } from "react-router-dom";
import genres from "./../../assets/data/genres.json";
import { ProductInterface } from "../../interfaces/product.interface";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { apiErrorHandler } from "../../utils/errorUtils";
import Loader from "../../components/Loader";
import { APIError } from "../../types/api-error.type";
import { Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Textarea } from "@nextui-org/react";

const ProductCreateScreen = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductInterface>({
    name: "",
    price: "",
    image: "/images/no-image.png", // default
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

  return (
    <>
      <Button color="primary" variant="bordered" onClick={() => navigate("/admin/productlist")}>
        Back
      </Button>

      <Card>
        <h1>New Product</h1>
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
            value={product.name}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          <Input type="file" label="Image" labelPlacement={"outside"} placeholder="Upload image" onChange={uploadFileHandler} color="primary" />

          <Dropdown>
            <DropdownTrigger>
              <Button variant="faded" color="primary">
                Select genre
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => setProduct({ ...product, genre: String(key) })}>
              {genres.map((genre) => (
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
          <p>Description</p>
          <Textarea
            label="Description"
            placeholder="Enter description"
            className="max-w-xs"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <Button type="submit" color="primary">
            Save
          </Button>
        </form>
      </Card>
    </>
  );
};

export default ProductCreateScreen;
