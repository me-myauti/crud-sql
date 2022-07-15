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

//Check Token Middleware
function checkToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if(!token){
    return res.status(401).json({err: "Acesso negado!"})
  }
  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret)
    next()
  } catch (err) {
    res.status(400).json({err: "Token inválido!"})
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
    res.cookie('token', token)
    return res.status(200).json({flag: "ok", token: token})
});

// Create
myRoutes.post("/createUser", async (req, res) => {
  const userData = ({ nome, cpf, senha, contato, admin } = req.body);
  const data = verifyIfDataExists(Object.entries(userData));
  if(userData.cpf.length != 11){
    return res.status(400).json({err: "CPF inválido"})
  }
  if (!data) {
    return res.status(400).json({ err: "Campos faltando, tente novamente!" });
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
    return res.status(400).json({ err: "Campos faltando! Por favor, preencha novamente!" });
  } else {
    if(userData.cnpj.length != 14){
      return res.status(400).json({err: "CNPJ inválido"})
    }

    const cnpjExists = await prisma.Empresa.findUnique({
      where: {
        cnpj: cnpj
      }
    })

    if(cnpjExists){
      return res.status(400).json({err: "Este CNPJ já está cadastrado!"}) 
    }

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

myRoutes.get("/listLoggedUser", checkToken, async(req, res)=>{
  const secret = process.env.SECRET
  const decoded = jwt.verify(req.cookies.token, secret)
  if(!decoded){
    return res.status(403).json({err: "Não foi possível decodificar o token"})
  }
  const decodedToInt = parseInt(decoded)
  const user = await prisma.Usuario.findUnique({
    where: {
      id: decodedToInt
    }
  })
  return res.status(200).json(user)
})


//delete
myRoutes.post("/deleteUser", async (req,res)=>{
  const { id } = req.body
  console.log(id)
  if(id){
    const deleteUser = await prisma.Empresa.delete({
      where: {
        "id": id
      },
    })
    if(deleteUser){
      return res.status(200).json({deleteUser})
    }else{
      return res.status(400)
    }
  }
})

module.exports = myRoutes;