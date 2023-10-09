const { contas, banco } = require("../bancodedados")
let { identificadorConta } = require("../bancodedados");

const listarContas = (req, res) => {
    const senha_principal = banco.senha;
    let { senha_banco } = req.query;

    if (senha_banco == senha_principal){
        return res.json(contas); 
    } else {
        return res.status(403).json ({ mensagem: "A senha do banco informada é inválida!"});
    }
}

const criarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {return res.status(400).json({mensagem: "O nome é obrigatório."})};
    if (!cpf) {return res.status(400).json({mensagem: "O cpf é obrigatório."})};
    if (!data_nascimento) {return res.status(400).json({mensagem: "A data de nascimento é obrigatório."})};
    if (!telefone) {return res.status(400).json({mensagem: "O telefone é obrigatório."})};
    if (!email) {return res.status(400).json({mensagem: "O email é obrigatório."})};
    if (!senha) {return res.status(400).json({mensagem: "A senha é obrigatório."})};


    const conta = {
        id: identificadorConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    } 


    contas.push(conta);
    return res.status(201).json(conta);




}


module.exports = {
    listarContas,
    criarContas
}

// if (nome) { res.send("Sim")}
//     else {res.send("não")}
//         console.log(req.body)


// 


//(req, res) => {
//     let { senha_banco } = req.query;
//     let { senha } = bancodedados.banco;

//     let resultado = [];

//    if (senha_banco !== senha) {
//     res.send ("Quase lá")
//    }
// }