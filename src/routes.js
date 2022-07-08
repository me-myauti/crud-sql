const express = require("express")
const myRoutes = express.Router()

const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();
// Create
myRoutes.post("/createUser", async (req, res) => {
    const {nome, cpf, senha, contato, admin} = req.body
    if(!nome || !cpf || !senha || !contato){
        return res.status(400).json({err: "Data is missing, check your fields!"})
    }
    const user = await prisma.Usuario.create({data:{
        nome,
        cpf,
        senha,
        contato,
        admin
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
myRoutes.get("/listUsers",  async (req, res)=>{
    const users = await prisma.Usuario.findMany()
    return res.status(200).json(users)
})

module.exports = myRoutes