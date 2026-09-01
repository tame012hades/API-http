import http from 'node:http'
import { URL } from 'node:url';

const porta = 3000

const tarefas = [
    {id: 1, titulo:'lavar loucas'},
    {id: 2, titulo: 'comprar uma RTX 5090'}
]

const server = http.createServer((requisicao, resposta) => {
    resposta.setHeader('Content-Type', 'application/json, charset=utf-8')

    const urlObj = new URL (requisicao.url, `http://${requisicao.deaders.host}`);

    if(requisicao.method == 'GET' && requisicao.url == '/tarefas'){
        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefas))
    }else if (requisicao.method == 'GET' && urlObj.pathname == '/tarefas/busca'){
        const titulo = urlObj.searchParams.get('titulo');
         const tarefasEncontradas = tarefas.filter((tarefa) =>
            tarefa.titulo.toLowerCase().includes(titulo.toLowerCase())
        );

        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefasEncontradas))
    
        }else if (requisicao.method == 'DELETE' && urlObj.pathname == '/tarefas'){
    const index = urlObj.searchParams.get('index');

    tarefas.splice(index, 2);

    resposta.statusCode = 200
    resposta.end(JSON.stringify({
        mensagem: 'Tarefa removida com sucesso!'
    }))}

    
    else if (requisicao.method == 'POST' && requisicao.url == '/tarefa'){
        let body = ''
        requisicao.on('data', (chunk) => {
            body += chunk.toString()
        })
        requisicao.on('end', () => {
            try {
             const novaTarefa = JSON.parse(body)
             if (!novaTarefa.titulo){
                resposta.statusCode = 400
                resposta.end(JSON.stringify({errpr: 'O campo "titulo" é obrigatório.' }));
             }

             const tarefaCriada = {
                id: tarefas.length + 1,
                titulo: novaTarefa.titulo
             }

             tarefas.push(tarefaCriada)

             resposta.statusCode = 201
             resposta.end(JSON.stringify(tarefaCriada))
             
            }   catch (error){ 
            
                resposta.statusCode = 400
                resposta.end(JSON.stringify({error:'Formato JSON invalido!'}))
                
            }
        })
    }else {
        resposta.statusCode = 404
        resposta.end(JSON.stringify({error: 'Pagina nao encontrada.'}));
        
    }

});

server.listen(porta, () => {
    console.log(`Servidor funcionando na pota ${porta}`);
});
