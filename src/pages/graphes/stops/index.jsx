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
  Checkbox,
  Footer,
} from "rsuite";
import { useState, useEffect } from "react";
import stopsFormModel from "../../../components/verify/stopsFormModel";
import GlobalParams from "../../../components/utils/global";
import { useNavigate } from "react-router";
const reminder =
  "This function page assists the calculation routes with max stops and specific stops.";
const stopsLabel = "Stops:";
const stepsLabel = "Steps";
export default function StopsSequence() {
  const toaster = useToaster();
  const [avlRoutes, setAvlRoutes] = useState([]);
  const [checked, setChecked] = useState(true);
  const navto = useNavigate();
  
  const handleChangeChkbox = ()=>{
    setChecked(!checked);
  };
  const handleSubmit = async (value) => {
    const { stops, steps } = value;
    if (!stops || !steps || isNaN(steps)) {
      toaster.push(
        <Notification type="warning" closable>
          <p>Stops and steps must has values, steps must be a number</p>
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
    if (stopsArr.length !== 2) {
      return toaster.push(
        <Notification type="warning" closable>
          <p>Please check the input stops, not start + end</p>
        </Notification>,
        { placement: "topCenter", duration: 2000 }
      );
    }
    var suffix = '';
    if (checked) {
        suffix = "/routeswithmaxstops?src=";
    }else{
        suffix = "/routeswithfixedstops?src=";
    }
    const url =
      GlobalParams.urlbase +
       suffix+
      stopsArr[0] +
      "&dest=" +
      stopsArr[1] +
      "&stops=" +
      steps;
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
          const jstr = json.result;
          if (jstr === "succeeded") {
            console.dir(json.msg);
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
      <Form model={stopsFormModel} layout="inline" onSubmit={handleSubmit}>
        <Grid fluid>
          <Row></Row>
          <Row></Row>
          <Row>
            <Col xs={24} sm={12} md={8}>
            <Form.Group controlId="stopsCtrl">
              <Form.ControlLabel>{stopsLabel}</Form.ControlLabel>
              <Form.Control name="stops" placeholder="A, D" />
              <Form.HelpText>
                If starts with A, ends with C, pls input A, C, use comma as
                separator. Case sensitive, require capitalization.
              </Form.HelpText>
              </Form.Group>
              <Form.Group controlId='stepsCtrl'>
              <Form.ControlLabel>{stepsLabel}</Form.ControlLabel>
              <Form.Control name="steps" placeholder="Given steps" />
              <Form.HelpText>
                Please input how many steps you want to reach the end.
              </Form.HelpText>
              </Form.Group>
              <Form.Group controlId="maxCtrl">
              <lable>Max steps:{' '}</lable>
              <Checkbox defaultChecked checked={checked} onChange={handleChangeChkbox}>Checked</Checkbox> 
              <Form.HelpText>
                If checked means the max step applied. If not checked means exactly the number of steps applied.
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
          Final Available routes of {' '}
          {checked?('max'):('fixed')}{' '}
          stops is:
          <br />
          {avlRoutes.map((item, idx) => (
            <Text color="cyan">{item}</Text>
          ))}
        </Content>
        <Footer>
        </Footer>
      </Container>
    </>
  );
}
