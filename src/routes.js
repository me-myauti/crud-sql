const express = require("express")
const allUsers = [{name:  "Teste"}]
const myRoutes = express.Router()

const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();

// Create
myRoutes.post("/createUser", async (req, res) => {
    const { nome, cpf, senha, contato} = req.body
    const user = await prisma.Usuario.create({data:{
        nome,
        cpf,
        senha,
        contato
    }})
    //allUsers.push({name})
    return res.status(201).json(user)
})

myRoutes.post("/createCustomer", async(req, res)=>{
    const { titular, cnpj, email_hospedagem, senha_hospedagem, email_empresa, nome_empresa, endereco, contato } = req.body
    const customer = await prisma.Empresa.create({data:{
        titular, 
        cnpj, 
        email_hospedagem, 
        senha_hospedagem, 
        email_empresa, 
        nome_empresa, 
        endereco, 
        contato
    }})
    return res.status(201).json(customer)
})

//Read
myRoutes.get("/listUsers",  (req, res)=>{
    return res.status(200).json(allUsers)
})

module.exports = myRoutes