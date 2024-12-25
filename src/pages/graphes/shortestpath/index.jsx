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
    "This function page assists the calculation the shortest path.";
  const stopsLabel = "Stops:";
  export default function ShortestPath() {
    const toaster = useToaster();
    const [avlRoutes, setAvlRoutes] = useState({distance:0, path:[]});
    const navto = useNavigate();
    const handleSubmit = async (value) => {
      const { stops } = value;
      if (!stops) {
        toaster.push(
          <Notification type="warn" closable>
            <p>Stops must have the value.....</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      // if (!/^([a-zA-Z],)*[a-zA-Z]$/.test(stops)){
      if (!/^[a-zA-Z]\s*,\s*[a-zA-Z]$/.test(stops)) {
        return toaster.push(
          <Notification type="warn" closable>
            <p>Please follow stops input rules.......</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const stopsArr = stops.split(",").map((item) => item.trim());
      if (stopsArr.length !== 2) {
        return toaster.push(
          <Notification type="warn" closable>
            <p>Please check the input stops, not start + end</p>
          </Notification>,
          { placement: "topCenter", duration: 2000 }
        );
      }
      const url =
        GlobalParams.urlbase +
         '/shortestpath?src='+
        stopsArr[0] +
        "&dest=" +
        stopsArr[1];
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
              setAvlRoutes({distance:json.msg.distance, path: json.msg.path});
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
            The shortest routes is:
            <br />
            {avlRoutes.path.length>0 ? 
              <div>
              <Text color="cyan">{'Path is: '}{avlRoutes.path}</Text>
              <Text color="cyan">{'Distance is: '}{avlRoutes.distance}</Text>
              </div>:
              <div>
              <Text color="cyan">{'No available shortest path exists...'}</Text>
              </div>
            }
          </Content>
        </Container>
      </>
    );
  }
  