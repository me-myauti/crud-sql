const express = require("express");
const myRoutes = express.Router();
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//Verify Data Function
function verifyIfDataExists(data) {
    const dataMissing = [];
    data.forEach((element) => {
      if (!element[1]) {
        dataMissing.push("Missing");
      } else {
        dataMissing.push("Ok");
      }
    });
    if (dataMissing.includes("Missing")) {
      return false;
    } else {
      return true;
    }
  }

//Verify If User Exists
function verifyIfUserExists(user){
    console.log(user)
}

//Login
myRoutes.post("/authenticateUser", async (req, res) => {
    const userData = { cpf, senha } = req.body;
    const data = verifyIfDataExists(Object.entries(userData))
    if(!data){
        return res.status(400).json({ err: "Data is missing, check your fields!" });
    }else{

    }

    const userLoggedIn = await prisma.Usuario.findMany({
        where: {
        cpf: cpf,
        },
    });

    verifyIfUserExists(userLoggedIn)

  /* if (userLoggedIn == "" || !userLoggedIn) {
    return res.status(401).json({ err: "Invalid credentials" });
  }
  if (userLoggedIn[0].senha != senha) {
    return res.status(401).json({ err: "Invalid credentials" });
  }
  return res.status(201).json(userLoggedIn[0]); */
});



// Create
myRoutes.post("/createUser", async (req, res) => {
  const userData = ({ nome, cpf, senha, contato, admin } = req.body);
  const data = verifyIfDataExists(Object.entries(userData));

  if (!data) {
    return res.status(400).json({ err: "Missing fields, try again!" });
  } else {
    const salt = await bcrypt.genSalt(12);
    const pswdhash = await bcrypt.hash(senha, salt);

    const user = await prisma.Usuario.create({
      data: {
        nome,
        cpf,
        senha: pswdhash,
        contato,
        admin,
      },
    });
    return res.status(201).json(user);
  }
});

myRoutes.post("/createCustomer", async (req, res) => {
  const userData = ({
    titular,
    cnpj,
    email_hospedagem,
    senha_hospedagem,
    email_empresa,
    nome_empresa,
    endereco,
    contato,
  } = req.body);

  const data = verifyIfDataExists(Object.entries(userData));

  if (!data) {
    return res.status(400).json({ err: "Data is missing" });
  } else {
    const customer = await prisma.Empresa.create({
      data: {
        titular,
        cnpj,
        email_hospedagem,
        senha_hospedagem,
        email_empresa,
        nome_empresa,
        endereco,
        contato,
      },
    });
    return res.status(201).json(customer);
  }
});

//Read
myRoutes.get("/listUsers", async (req, res) => {
  const users = await prisma.Usuario.findMany();
  return res.status(200).json(users);
});

myRoutes.get("/listCustomers", async (req, res) => {
  const customers = await prisma.Empresa.findMany();
  return res.status(200).json(customers);
});

//Update

myRoutes.post("/updateUsers", async (req, res) => {
  const { id, nome, cpf, senha, contato } = req.body;
  const updateUser = await prisma.Usuario.update({
    where: {
      id: id,
    },
  });
});

module.exports = myRoutes;
