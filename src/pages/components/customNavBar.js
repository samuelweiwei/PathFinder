import { Navbar, Nav } from "rsuite";
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
    return (
      <Navbar {...props}>
        <Navbar.Brand href="#">
          Transportation Network Planning - powered by ACME
        </Navbar.Brand>
        {/* <Nav onSelect={onSelect} activeKey={activeKey}>
          <Nav.Item eventKey="1">Home</Nav.Item>
          <Nav.Item eventKey="2">News</Nav.Item>
          <Nav.Item eventKey="3">Products</Nav.Item>
          <Nav.Menu title="About">
            <Nav.Item eventKey="4">Company</Nav.Item>
            <Nav.Item eventKey="5">Team</Nav.Item>
            <Nav.Item eventKey="6">Contact</Nav.Item>
          </Nav.Menu>
        </Nav>
        <Nav pullRight>
          <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
        </Nav> */}
      </Navbar>
    );
  };

  export default CustomNavbar;
  