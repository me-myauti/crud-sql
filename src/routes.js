const express = require("express");
require('dotenv').config()
const myRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if(!user){
        return false;
    }else{
        return true;
    }
}

//Login
myRoutes.post("/authenticateUser", async (req, res) => {
    const userData = { cpf, senha } = req.body;
    const data = verifyIfDataExists(Object.entries(userData))
    if(!data){
        return res.status(400).json({ err: "Data is missing, check your fields!" });
    }
    const userLoggedIn = await prisma.Usuario.findUnique({
        where: {
        cpf: cpf,
        },
    });

    const user = verifyIfUserExists(userLoggedIn)
    if(!user){
        return res.status(400).json({ err: "Invalid credentials!" });
    }

    const pswdIsOk = await bcrypt.compare(senha, userLoggedIn.senha)
    if(!pswdIsOk){
        return res.status(400).json({ err: "Invalid credentials!" });
    }
    const secret = process.env.SECRET
    let token = jwt.sign(userLoggedIn.id, secret)
    res.cookie('token', token, {httpOnly: true})
    return res.status(200).json({flag: "ok"})
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

module.exports = myRoutes;