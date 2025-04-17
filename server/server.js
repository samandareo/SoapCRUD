import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { parseString, Builder } from "xml2js";
import compression from "compression";

const PORT = 4000;

const users = [
  { id: 1, name: "test", email: "test@gmail.com" },
  { id: 2, name: "test2", email: "test2@gmail.com" },
];

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: "text/xml" }));
app.use(compression());

const soapResponseBuilder = (data) => {
  const builder = new Builder({
    headless: true,
  });

  const response = {
    "soap:Envelope": {
      $: {
        "xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
      },

    "soap:Body": {
        getUsersResponse: {
          users: users,
        },
      },
    },
  };
  return builder.buildObject(response);
}

const soapFaultResponseBuilder = (code, message) => {
  const builder = new Builder({
    headless: true,
  });

  const faultResponse = {
    "soap:Envelope": {
      $: {
        "xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
      },

    "soap:Body": {
      },
    },
  };

  faultResponse["soap:Envelope"]["soap:Fault"] = {
    faultCode: code,
    faultString: message,
  };

  return builder.buildObject(faultResponse);
}

app.post("/soap", (req, res) => {
  parseString(req.body, (err, result) => {
    if (err) {
      const FaultObject = soapFaultResponseBuilder("soap:Client", "Invalid XML format");
      res.status(400).send(FaultObject);
    }

    const body = result["soap:Envelope"]["soap:Body"][0];

    if (body.getUsersRequest) {
      const response = soapResponseBuilder(users);
      res.set("Content-Type", "text/xml");
      res.send(response);
    }else if (body.createUserRequest) {
      const user = body.createUserRequest[0].user[0];
      const newUser = {
        id: users.length + 1,
        name: user.name[0],
        email: user.email[0],
      };
      users.push(newUser);
      const response = soapResponseBuilder(newUser);
      res.set("Content-Type", "text/xml");
      res.send(response);
    }else if (body.deleteUserRequest) {
      const userId = parseInt(body.deleteUserRequest[0].userId[0], 10);
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        const response = soapResponseBuilder({ message: "User deleted successfully" });
        res.set("Content-Type", "text/xml");
        res.send(response);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    }else if (body.updateUserRequest) {
      const userId = parseInt(body.updateUserRequest[0].userId[0], 10);
      const userIndex = users.findIndex((user) => user.id === userId);
      console.log(userIndex);
      if (userIndex !== -1) {
        const user = body.updateUserRequest[0].user[0];
        console.log(user);
        users[userIndex].name = user.name[0];
        users[userIndex].email = user.email[0];
        const response = soapResponseBuilder(users[userIndex]);
        res.set("Content-Type", "text/xml");
        res.send(response);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    }else{
      const FaultObject = soapFaultResponseBuilder("soap:Client", "Invalid SOAP Action");
      res.status(400).send(FaultObject);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});