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
    Text
  } from "rsuite";
  import { useState, useEffect } from "react";
  import shortestFormModel from "../../../components/verify/shortestFormModel";
  import GlobalParams from "../../../components/utils/global";
import { useNavigate } from "react-router";
  const reminder =
    "This function page assists the calculation the path total distance.";
  const stopsLabel = "Stops:";
  export default function PathDistance() {
    const toaster = useToaster();
    const [routeDist, setRouteDist] = useState(0);
    const navto = useNavigate();
    const handleSubmit = async (value) => {
      const { stops } = value;
      if (!stops) {
        toaster.push(
          <Notification type="warning" closable>
            <p>Stops must have the value....</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      // if (!/^([a-zA-Z],)*[a-zA-Z]$/.test(stops)){
      if (!/^[a-zA-Z]\s*(,\s*[a-zA-Z])+$/.test(stops.trim())) {
        return toaster.push(
          <Notification type="warning" closable>
            <p>Please follow stops input rules.......</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const stopsArr = stops.split(",").map((item) => item.trim());
      if (stopsArr.length < 2) {
        return toaster.push(
          <Notification type="warning" closable>
            <p>Please check the input stops, not less than 2 stops</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const url =
        GlobalParams.urlbase +
         '/distances?stops='+stops;
         console.log(localStorage.getItem("sessionId"));
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
          (error) => console.error(`onRejected function called: ${error}`)
        )
        .then(
          (json) => {
            const jstr = json.result;
            if (jstr === "succeeded") {
              setRouteDist(json.msg.distance);
            }
          },
          (error) => console.error(`onRejected function called: ${error}`)
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
        <Form model={shortestFormModel} layout="inline" onSubmit={handleSubmit}>
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
            The Distance is:
            <br />
            {routeDist>0 ? 
              <div>
              <Text color="cyan">{'Distance is: '}{routeDist}</Text>
              </div>:
              <div>
              <Text color="cyan">{'No available path distance exists...'}</Text>
              </div>
            }
          </Content>
        </Container>
      </>
    );
  }
  