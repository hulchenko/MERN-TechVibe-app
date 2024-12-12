import { Button, Divider, Form, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductFormValidators, ProductInterface } from "../../interfaces/product.interface";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";
import genres from "./../../assets/data/genres.json";

const ProductCreateScreen = () => {
  const navigate = useNavigate();

  const [validators, setValidators] = useState<ProductFormValidators>({ name: true, price: true, genre: true, countInStock: true, description: true });
  const [product, setProduct] = useState<ProductInterface>({
    name: "",
    price: 0,
    image: "/images/no-image.jpg", // default
    genre: "",
    countInStock: 1,
    description: "",
  });

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, price, genre, countInStock, description } = product;
    const formValidators: ProductFormValidators = {
      name: name.length > 0,
      price: price > 0,
      genre: genre.length > 0,
      countInStock: countInStock > 0,
      description: description.length > 0,
    };

    setValidators(formValidators);
    const isInvalid = Object.values(formValidators).includes(false);
    if (isInvalid) return;

    const result = await createProduct(product);
    if (result.error) {
      toast.error((result.error as APIError).data.message);
    } else {
      toast.success("Product created");
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

  return (
    <>
      <div className="flex justify-center items-center mt-12 h-6 gap-2">
        <Button color="primary" variant="bordered" onClick={() => navigate("/admin/productlist")}>
          Products
        </Button>
        <Divider orientation="vertical" />
        <h1 className="text-lg font-bold">New Product</h1>
      </div>

      <div className="w-full flex justify-center mt-12">
        <Form onSubmit={submitHandler} className="w-full max-w-80 flex flex-col gap-4 mt-4">
          <Input
            isRequired
            color="primary"
            variant="bordered"
            type="text"
            label="Name"
            labelPlacement={"outside"}
            placeholder="Enter name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            isInvalid={!validators.name}
            errorMessage={"Field cannot be empty"}
          />
          <Input
            isRequired
            color="primary"
            variant="bordered"
            type="number"
            label="Price"
            labelPlacement={"outside"}
            placeholder="Enter price"
            value={String(product.price)}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            isInvalid={!validators.price}
            errorMessage={"Cannot be 0 or less"}
          />
          <Input
            color="primary"
            variant="bordered"
            type="file"
            label="Image"
            labelPlacement={"outside"}
            placeholder="Upload image"
            onChange={uploadFileHandler}
            className="text-violet-500"
          />
          <Select
            color="primary"
            variant="bordered"
            isRequired
            label="Genre"
            labelPlacement="outside"
            placeholder="Select genre"
            isInvalid={!validators.genre}
            errorMessage={"Please select a genre"}
          >
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre} onClick={(e) => setProduct({ ...product, genre: String(e.currentTarget.value) })}>
                {genre}
              </SelectItem>
            ))}
          </Select>
          <Input
            isRequired
            color="primary"
            type="number"
            label="Count In Stock"
            labelPlacement={"outside"}
            placeholder="Enter stock qty"
            variant="bordered"
            min={1}
            max={99}
            value={String(product.countInStock)}
            onChange={(e) => setProduct({ ...product, countInStock: Number(e.target.value) })}
          />
          <Textarea
            isRequired
            color="primary"
            variant="bordered"
            label="Description"
            labelPlacement={"outside"}
            placeholder="Enter description"
            className="max-w-xs"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <Button isLoading={loadingCreate} type="submit" color="primary" variant="solid">
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ProductCreateScreen;
