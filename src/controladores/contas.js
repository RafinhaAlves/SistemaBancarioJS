let { contas, banco, saques, depositos, transferencias } = require("../bancodedados");
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
const saldo = conta.saldo

if (saldo > 0) {
    return res.status(404).json({ mensagem: "A conta só pode ser removida se o saldo for zero!"})
}
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

const depositarConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(404).json({ mensagem: "O número da conta e o valor são obrigatórios!"});
    };
    const contaADepositar = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })
    if (!contaADepositar) {
        return res.status(404).json({ mensagem: "Conta não existe!"})
    }
    if (numero_conta <= 0) {
        return res.status(404).json({ mensagem: "Valor zerado ou negativo!"})
    }
    contaADepositar.saldo = valor + contaADepositar.saldo;
    
    depositos.push({
        data: new Date().toLocaleString(),
        numero_conta,
        valor
    })
    
    return res.status(204).send()
}

const sacarDaConta = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(404).json({ mensagem: "Numero da conta, valor e senha são obrigatorios!"});
    }
    if (valor <= 0) {
        return res.status(404).json({ mensagem: "O valor não pode ser menor que zero!"})
    }

    const verficarConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if (!verficarConta) {
        return res.status(404).json({ mensagem: "Conta não existe!"});
    }
    if (verficarConta.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta!"});
    }
    if (verficarConta.saldo <= 0) {
        return res.status(404).json ({ mensagem: "Saldo insuficiente!"});
    }
    verficarConta.saldo = verficarConta.saldo - valor

    saques.push({
        data: new Date().toLocaleString(),
        numero_conta,
        valor
    })
    

    return res.status(204).send()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha ) {
        return res.status(404).json({ mensagem: "Dados informados não validos!"});
    }
    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)});
    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)});
    
    if (!contaOrigem) {return res.status(404).json({ mensagem: "Conta de origem inexistente."})};
    if (!contaDestino) {return res.status(404).json({ mensagem: "Conta de destino inexistente."})};
    
    if(contaOrigem.usuario.senha !== senha) {
        return res.status(404).json({ mensagem: "Senha incorreta."})};

    if(contaOrigem.saldo < valor){
        return res.status(404).json({ mensagem: "Saldo insuficiente."})};

    contaOrigem.saldo = contaOrigem.saldo - valor;
    contaDestino.saldo = contaDestino.saldo + valor;

        transferencias.push({
            data: new Date().toLocaleString(),
            numero_conta_destino,
            numero_conta_origem,
            valor
        })

    return res.status(204).send()
}

const saldo = (req, res) => {
 const { numero_conta, senha } = req.query;

 const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta)
 });
 if(!conta) {return res.status(404).json({ mensagem: "Conta bancária não encontrada!"})};
 if(conta.usuario.senha !== senha) {
    return res.status(404).json({ mensagem: "Senha incorreta!"})};
    
    return res.status(200).json({ saldo: conta.saldo})
 
}


module.exports = {
    listarContas,
    criarContas,
    deletarConta,
    atualizarConta,
    depositarConta,
    sacarDaConta,
    transferir,
    saldo
    
}

