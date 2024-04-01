import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useUpdateProductMutation, useGetProductDetailsQuery } from '../../slices/productsApiSlice';


const ProductEditScreen = () => {
    return (
        <div>ProductEditScreen</div>
    );
};

export default ProductEditScreen;