import { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type='radio' className='my-2' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </Col>
                </Form.Group>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;