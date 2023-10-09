const express = require("express");
const rotas = express();
const contas = require("./controladores/contas")

rotas.get("/", (req, res) => {
    res.send("Tudo ok");

});




rotas.get("/contas", contas.listarContas);

module.exports = rotas