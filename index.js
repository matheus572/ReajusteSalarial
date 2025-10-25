import express from 'express';


const host = '0.0.0.0';
const porta = 3000;

const server = express();

server.get('/', (requisicao, resposta) => {
    resposta.send(`
        <DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Primeiro programa para a internet usando node + express</title>
        </head>
        <body>
            <h1>Cálculo de Reajuste Salarial</h1>
                <p>Bem-vindo ao sistema de cálculo de reajuste de salário.</p>
                <p>Para calcular o seu reajuste, acesse a rota <code>/calcular</code> e informe os seguintes dados na URL:</p>
                <ul>
                    <li>idade (ex: idade=30)</li>
                    <li>sexo (ex: sexo=(M ou F))</li>
                    <li>salario_base (ex: salario_base=2500.50)</li>
                    <li>anoContratacao (ex: anoContratacao=2015)</li>
                    <li>matricula (ex: matricula=12345)</li>
                </ul>
                <p><strong>Exemplo de URL completa:</strong></p>
                <p><code>http://localhost:${porta}/calcular?idade=30&sexo=M&salario_base=2500&anoContratacao=2010&matricula=12345</code></p>
        </body>
        </html>

    `);
});

server.get('/calcular', (requisicao, resposta) => {
    const idade = parseInt(requisicao.query.idade);
    const sexo = requisicao.query.sexo;
    const salario_base = parseFloat(requisicao.query.salario_base);
    const anoContratacao = parseInt(requisicao.query.anoContratacao);
    const matricula = parseInt(requisicao.query.matricula);

    let percentualReajuste = 0;
    let valorDesconto = 0;
    let valorAcrescimo = 0;
    let salarioReajustado = 0;
    let novoSalario = salario_base;
    
    if (isNaN(idade)) {
        return resposta.send('Erro: A idade deve ser um número válido.');
    }
    if (idade <= 16) {
        return resposta.send('Erro: A idade deve ser maior que 16.');
    }

    if (isNaN(salario_base)) {
        return resposta.send('Erro: O salario_base deve ser um número válido.');
    }
    if (salario_base <= 0) {
        return resposta.send('Erro: O salario_base deve ser um número real válido.');
    }

    if (isNaN(anoContratacao)) {
        return resposta.send('Erro: O anoContratacao deve ser um número válido.');
    }
    if (anoContratacao <= 1960) {
        return resposta.send('Erro: O anoContratacao deve ser maior que 1960.');
    }

    if (isNaN(matricula)) {
        return resposta.send('Erro: A matricula deve ser um número válido.');
    }
    if (matricula <= 0) {
        return resposta.send('Erro: A matricula deve ser maior que 0.');
    }

    const anoAtual = new Date().getFullYear();
    const anosDeEmpresa = anoAtual - anoContratacao;

        //idade: 18 - 39
    if (idade >= 18 && idade <= 39) {
        if (sexo == 'M') {
            percentualReajuste = 0.10;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 10.00;
            } else {
                valorAcrescimo = 17.00;
            }
        } else if (sexo == 'F') {
            percentualReajuste = 0.08;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 11.00;
            } else {
                valorAcrescimo = 16.00;
            }
        }
    }
    //idade: 40 - 69
    else if (idade >= 40 && idade <= 69) {
        if (sexo == 'M') {
            percentualReajuste = 0.08;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 5.00;
            } else {
                valorAcrescimo = 15.00;
            }
        } else if (sexo == 'F') {
            percentualReajuste = 0.10;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 7.00;
            } else {
                valorAcrescimo = 14.00;
            }
        }
    }
    //idade: 70 - 99
    else if (idade >= 70 && idade <= 99) {
        if (sexo == 'M') {
            percentualReajuste = 0.15;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 15.00;
            } else {
                valorAcrescimo = 13.00;
            }
        } else if (sexo == 'F') {
                percentualReajuste = 0.17;
            if (anosDeEmpresa <= 10) {
                valorDesconto = 17.00;
            } else {
                valorAcrescimo = 12.00;
            }
        }
    }
        //aplica o cálculo
    if (percentualReajuste > 0) {
         salarioReajustado = salario_base * (1 + percentualReajuste);
         novoSalario = salarioReajustado - valorDesconto + valorAcrescimo;
    }

    resposta.send(`
        <DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Resultado do Cálculo</title>
        </head>
        <body>
            <h1>Dados Recebidos do Funcionário</h1>
            <p>Matrícula: ${matricula}</p>
            <p>Idade: ${idade}</p>
            <p>Sexo: ${sexo}</p>
            <p>Salário Base: ${salario_base}</p>
            <p>Ano de Contratação: ${anoContratacao}</p>
            <hr>
            <p>Novo Salário: R$${novoSalario.toFixed(2)}</p>
        </body>
        </html>
    `);
});

server.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
});