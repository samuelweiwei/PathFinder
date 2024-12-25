import "./App.css";
import "rsuite/dist/rsuite.min.css";
import { useState, useEffect } from "react";
import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Navbar,
  IconButton,
  Stack,
} from "rsuite";
import { Icon } from "@rsuite/icons";
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import {
  MdDashboard,
  MdOutlineStackedBarChart,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import StopsSequence from "./pages/graphes/stops";
import ShortestPath from "./pages/graphes/shortestpath";
import PathDistance from "./pages/graphes/distances";
import RoutesWithDistances from "./pages/graphes/graphesWithDistance";
import CustomNavbar from "./pages/components/customNavBar";
import { useNavigate } from "react-router";

function Layout() {
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const [contentStatus, setContentStatus] = useState({
    stopsteps: false,
    shortest: false,
    distances: false,
    routesDist: false
  });
  const navto = useNavigate();

  function handleLogout(){
    console.log("log out");
    localStorage.removeItem("sessionId");
    navto("/");
  }

  function handleEvent1() {
    setContentStatus({
      stopsteps: true,
      shortest: false,
      distances: false,
      routesDist: false
    });
  }

  function handleEvent2() {
    setContentStatus({
      stopsteps: false,
      shortest: true,
      distances: false,
      routesDist: false
    });
  }

  function handleEvent3() {
    setContentStatus({
      stopsteps: false,
      shortest: false,
      distances: true,
      routesDist: false
    });
  }
  function handleEvent4() {
    setContentStatus({
      stopsteps: false,
      shortest: false,
      distances: false,
      routesDist: true
    });
  }
  useEffect(() => {
    if (!window.localStorage.getItem("sessionId")) {
      navto("/");
    }
  }, []);
  return (
    <>
      <div height={800} className="show-container">
        <CustomNavbar
          appearance="inverse"
          activeKey={activeKey}
          onSelect={setActiveKey}
        />
        <Container>
          <Sidebar
            style={{ display: "flex", flexDirection: "column" }}
            width={expand ? 260 : 56}
            collapsible
          >
            <Sidenav
              expanded={expand}
              defaultOpenKeys={["3"]}
              appearance="subtle"
            >
              <Sidenav.Body>
                <Nav defaultActiveKey="1">
                  <Nav.Item eventKey="1" icon={<Icon as={MdDashboard} />}>
                    Dashboard
                  </Nav.Item>
                  <Nav.Menu
                    eventKey="3"
                    trigger="hover"
                    title="Advanced"
                    icon={<Icon as={MdOutlineStackedBarChart} />}
                    placement="rightStart"
                  >
                    <Nav.Item eventKey="3-1" onSelect={handleEvent1}>
                      Routes With Stops
                    </Nav.Item>
                    <Nav.Item eventKey="3-2" onSelect={handleEvent2}>
                      Shortest Routes
                    </Nav.Item>
                    <Nav.Item eventKey="3-3" onSelect={handleEvent3}>
                      Path Distances
                    </Nav.Item>
                    <Nav.Item eventKey="3-4" onSelect={handleEvent4}>
                      Routes with distance limit
                    </Nav.Item>
                  </Nav.Menu>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
            <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
          </Sidebar>

          <Container>
            <Header className="page-header"></Header>
            <Content>
              {contentStatus.stopsteps && <StopsSequence />}
              {contentStatus.shortest && <p><ShortestPath /></p>}
              {contentStatus.distances && <p><PathDistance /></p>}
              {contentStatus.routesDist && <p><RoutesWithDistances /></p>}
            </Content>
          </Container>
        </Container>
      </div>
      <div>
        <Nav pullLeft>
          <Nav.Item icon={<CloseOutlineIcon />} onSelect={handleLogout} eventKey='1'>Logout</Nav.Item>
        </Nav>
      </div>

      {/* <div style={{ flex: 1, padding: '10px' }}>
  <Outlet />
</div> */}
    </>
  );
}

const NavToggle = ({ expand, onChange }) => {
  return (
    <Stack
      className="nav-toggle"
      justifyContent={expand ? "flex-end" : "center"}
    >
      <IconButton
        onClick={onChange}
        appearance="subtle"
        size="lg"
        icon={
          expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />
        }
      />
    </Stack>
  );
};
  
export default Layout;
