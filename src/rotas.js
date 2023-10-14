const express = require("express");
const rotas = express();
const contas = require("./controladores/contas");


rotas.get("/", (req, res) => {
    res.send("Tudo ok");

});




rotas.get("/contas", contas.listarContas);
rotas.post("/contas", contas.criarContas);

rotas.delete("/contas/:numeroConta", contas.deletarConta);
rotas.put("/contas/:numeroConta", contas.atualizarConta);
rotas.post("/transacoes/depositar", contas.depositarConta);
rotas.post("/transacoes/sacar", contas.sacarDaConta);
rotas.get("/transacoes/transferir", contas.transferir);
rotas.get("/contas/saldo", contas.saldo);
rotas.get("/contas/extrato", contas.extrato);



module.exports = rotas;