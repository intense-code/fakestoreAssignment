import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function ButtonBar() {
  return (
    <div className="container-fluid p-0 m-0">
      <div className="d-flex justify-content-center align-items-center my-4" style={{ minHeight: '56px' }}>
        <ButtonGroup aria-label="Basic example">
          <Button href={'/'} variant="primary">Home</Button>
          <Button href={'/products'} variant="secondary">Products</Button>
          <Button href={'/about'} variant="success">About</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default ButtonBar;