import {
    Grid,
    Row,
    Col,
    Divider,
    Message,
    Button,
    Form,
    useToaster,
    Notification,
    Content,
    Container,
    Text,
    Footer,
  } from "rsuite";
  import { useState, useEffect } from "react";
  import routeDistFormModel from '../../../components/verify/routeDistFormModel'
  import GlobalParams from "../../../components/utils/global";
import { useNavigate } from "react-router";
  const reminder =
    "This function page assists the calculation routes with max stops and specific stops.";
  const stopsLabel = "Stops:";
  const distLabel = "Max Distances:";
  export default function RoutesWithDistances() {
    const toaster = useToaster();
    const [avlRoutes, setAvlRoutes] = useState([]);
    const navto = useNavigate();
    const handleSubmit = async (value) => {
      const { stops, dist } = value;
      if (!stops || !dist || isNaN(dist)) {
        toaster.push(
          <Notification type="warning" closable>
            <p>Stops and distance must has values, distance  must be a number</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      // if (!/^([a-zA-Z],)*[a-zA-Z]$/.test(stops)){
      if (!/^[a-zA-Z]\s*,\s*[a-zA-Z]$/.test(stops)) {
        return toaster.push(
          <Notification type="warning" closable>
            <p>Please follow stops input rules.......!!!!</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const stopsArr = stops.split(",").map((item) => item.trim());
      if (stopsArr.length < 2) {
        return toaster.push(
          <Notification type="warning" closable>
            <p>Please check the input stops, not start + end</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const url =
        GlobalParams.urlbase +
         "/routeswithmaxdist?src="+
        stopsArr[0] +
        "&dest=" +
        stopsArr[1] +
        "&dist=" +
        dist;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("sessionId")
        },
      })
        .then(
          (res) => {
            return res.json();
          },
          (error) => console.error(`onRejected function called: ${error.message}`)
        )
        .then(
          (json) => {
            console.log(json.msg)
            if (json.result === "succeeded") {
              setAvlRoutes(json.msg);
            }
          },
          (error) => console.error(`onRejected function called: ${error.message}`)
        );
    };
    useEffect(() => {
      if (!window.localStorage.getItem("sessionId")) {
        navto("/");
      }
    }, []);
    return (
      <>
        <Message type="info">
          <strong>{reminder}</strong>
        </Message>
        <Divider />
        <Form layout="inline" onSubmit={handleSubmit}>
          <Grid fluid>
            <Row></Row>
            <Row></Row>
            <Row>
              <Col xs={24} sm={12} md={8}>
              <Form.Group controlId="stopsCtrl">
                <Form.ControlLabel>{stopsLabel}</Form.ControlLabel>
                <Form.Control model={routeDistFormModel} name="stops" placeholder="A, D" />
                <Form.HelpText>
                  If starts with A, ends with C, pls input A, C, use comma as
                  separator. Case sensitive, require capitalization.
                </Form.HelpText>
                </Form.Group>
                <Form.Group controlId="distCtrl">
                <Form.ControlLabel>{distLabel}</Form.ControlLabel>
                <Form.Control name="dist" placeholder="Give max distance" />
                <Form.HelpText>
                  Please input how much the distance is that you want to reach the end.
                </Form.HelpText>
                </Form.Group>
                <br />
                <Form.Group>
                <Button type="submit">Submit</Button>
                </Form.Group>
              </Col>
            </Row>
          </Grid>
        </Form>
        <Divider />
        <Container>
          <Content>
            Final Available routes is:
            <br />
            {avlRoutes.length > 0 ? avlRoutes.map((item, idx)=>(
              <div>              
              <Text color="cyan">{'Path is: '}{item.path}</Text>
              <Text color="cyan">{'Distance is: '}{item.distance}</Text>
              <p/>
              </div>)) :
              <div>
              <Text color="cyan">{'No available shortest path exists...'}</Text>
              </div>
            }
          </Content>
          <Footer>
          </Footer>
        </Container>
      </>
    );
  }
  