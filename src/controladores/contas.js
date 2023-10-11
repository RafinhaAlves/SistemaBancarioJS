let { contas, banco } = require("../bancodedados");
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
        numero: identificadorConta++,
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

const deletarConta = (req, res) => { 
    const { numeroConta } = req.params;
    const conta = contas.find((elemento) => {
            return elemento.numero === Number(numeroConta)
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "A conta não existe."})
    };

    contas = contas.filter((elemento) => {
        return elemento.numero !== Number(numeroConta);
    });


    return res.status(204).send();
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "aaaaa"});
    }
    const contaAtualizar = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if (!contaAtualizar) {
        return res.status(404).json({ mensagem: "Num tem conta boy"});
    }
    
const informacoes = contaAtualizar.usuario

    informacoes.nome = nome;
    informacoes.cpf = cpf;
    informacoes.data_nascimento = data_nascimento;
    informacoes.telefone = telefone;
    informacoes.email = email;
    informacoes.senha = senha;

   return res.status(204).send();
}
module.exports = {
    listarContas,
    criarContas,
    deletarConta,
    atualizarConta
}

