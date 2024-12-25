import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Form,
  Button,
  ButtonToolbar,
  Container,
  Header,
  Content,
} from "rsuite";
import CustomNavbar from "../components/customNavBar";
import loginFormModel from "../../components/verify/loginFormModel";
import GlobalParams from "../../components/utils/global";
import "./index.css";

export default function FormLogin() {
  const nav = useNavigate();
  const [activeKey, setActiveKey] = useState(null);

  const handleSubmit = async (value) => {
    const {username, password} = value;
    const loginUrl = GlobalParams.urlbase+"/login?username="+username+"&password="+password;
    if (username && password){
        fetch(loginUrl, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
              },
        }).then((res)=>{
            return res.json();
        },
            (error) => console.error(`onRejected function called: ${error.message}`)
        ).then((json)=>{
            console.log(json);
            const jstr = json.result;
            if (jstr === "succeeded") {
                localStorage.setItem('sessionId', json?.msg);
                nav("/home");
            }
          },
          (error) => console.error(`onRejected function called: ${error.message}`)
        )
    }
    // if (userName && password) {
    //   const res = await formReq({
    //     url: '/login',
    //     data: {
    //       loginname: userName,
    //       password
    //     },
    //     errorMsg:'用户名或密码错误'
    //   })
    //   form({
    //     url: 'http://localhost:/users/login',
    //     data: {
    //       username: 'admin',
    //       password: 'admin123',
    //       rememberMe: false
    //     }
    //   })
    //   window.localStorage.setItem('sessionId', res?.data?.sessionId)
    //   window.localStorage.setItem('userInfo', JSON.stringify(res?.data))

    // } else {
    //   console.error('Wrong user and password');
    // }
    // nav('/page/auth')
  };
  useEffect(() => {
    if (window.localStorage.getItem("sessionId")) {
      nav("/home");
    }else{
      nav("/");
    }
  }, []);

  return (
    <>
    <div height={300} className="show-container">
      <CustomNavbar
        appearance="inverse"
        activeKey={activeKey}
        onSelect={setActiveKey}
      />
    </div>
    <div style={{width:'300px', justifyContent:'center'}} className="div-center">
      <Container>
        <Header appearance="inverse"></Header>
        <Content className="">
          <Form fluid model={loginFormModel} onSubmit={handleSubmit}>
            <Form.Group controlId="usrname">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username"/>
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="pswd">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
              />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">Submit</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Content>
      </Container>
      </div>
      </>
  );
}
