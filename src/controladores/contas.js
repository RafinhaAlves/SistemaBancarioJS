const { contas, banco } = require("../bancodedados")

const listarContas = (req, res) => {
    const senha_principal = banco.senha;
    let { senha_banco } = req.query;

    if (senha_banco == senha_principal){
        return res.json(contas); 
    } else {
        return res.status(403).json ({ mensagem: "A senha do banco informada é inválida!"});
    }
}




module.exports = {
    listarContas
}







//(req, res) => {
//     let { senha_banco } = req.query;
//     let { senha } = bancodedados.banco;

//     let resultado = [];

//    if (senha_banco !== senha) {
//     res.send ("Quase lá")
//    }
// }