import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>&copy; {year}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
