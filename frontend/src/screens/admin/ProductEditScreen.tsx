import { Button, Divider, Form, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import genres from "../../assets/data/genres.json";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { ProductFormValidators, ProductInterface } from "../../interfaces/product.interface";
import { useGetAWSCredentialsQuery } from "../../slices/externalApiSlice";
import { useGetProductDetailsQuery, useUpdateProductMutation } from "../../slices/productsApiSlice";
import { APIError } from "../../types/api-error.type";
import { uploadFileToS3 } from "../../utils/uploadImageS3";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [validators, setValidators] = useState<ProductFormValidators>({ name: true, price: true, genre: true, countInStock: true, description: true });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [product, setProduct] = useState<ProductInterface>({
    productId,
    name: "",
    price: 0,
    image: "/images/no-image.jpg", // default
    genre: "",
    countInStock: 1,
    description: "",
  });

  const { data: initProduct, isLoading, error: getProductError } = useGetProductDetailsQuery(productId || "");
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const { data: AWSCreds } = useGetAWSCredentialsQuery();

  const navigate = useNavigate();

  useEffect(() => {
    // update initial values
    if (initProduct) {
      const { name, price, image, genre, countInStock, description } = initProduct;
      setProduct({
        ...product,
        name,
        price,
        image,
        genre,
        countInStock,
        description,
      });
    }
  }, [initProduct]);

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

    const uploadedFileURL = await getUploadFileURL(fileToUpload);
    if (uploadedFileURL) {
      product.image = uploadedFileURL;
    }

    const result = await updateProduct(product);
    if (result.error) {
      toast.error((result.error as APIError).data.message);
    } else {
      toast.success("Product updated");
      navigate("/admin/productlist");
    }
  };

  const prepUploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files ? files[0] : null;
    if (file) {
      setFileToUpload(file);
    }
  };

  const getUploadFileURL = async (file: File | null) => {
    if (!file) return;
    return await uploadFileToS3(AWSCreds, file);
  };

  if (isLoading) return <Loader />;
  if (getProductError) return <Message color="danger" title="Error" description={getProductError} />;

  return (
    <>
      <div className="flex justify-center items-center mt-12 h-6 gap-2">
        <Button color="primary" variant="bordered" onClick={() => navigate("/admin/productlist")}>
          Products
        </Button>
        <Divider orientation="vertical" />
        <h1 className="text-lg font-bold">Edit Product</h1>
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
            accept="image/png, image/jpeg"
            onChange={prepUploadFile}
            className="text-violet-500"
          />
          <Select
            color="primary"
            variant="bordered"
            isRequired
            label="Genre"
            labelPlacement="outside"
            placeholder={product.genre || "Select genre"}
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
          <Button isLoading={loadingUpdate} type="submit" color="primary" variant="solid">
            Update
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ProductEditScreen;
