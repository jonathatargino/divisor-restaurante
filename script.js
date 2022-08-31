/* Elementos HTML atribuídos a variáveis  */

const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#name");

const foodForm = document.querySelector("#food-form");
const foodNameInput = document.querySelector("#foodName");
const foodPriceInput = document.querySelector("#foodPrice");

const clients = document.querySelector(".clients");
const foods = document.querySelector(".foods");

const relationForm = document.querySelector("#relation-form");
const paymentOptionInput = document.querySelector('#payment-option');

const pedidosDiv = document.querySelector(".pedidos");
const mostrarPedidosBtn = document.querySelector("#show-relations");
const calcularBtn = document.querySelector("#calcularBtn");

const clearInterfaceBtn = document.querySelector("#clearInterface");
const clearProductBtn = document.querySelector("#clearFoods");
const clearClientBtn = document.querySelector("#clearClients")

/* Classes */


class Produto {
    constructor(nome, preco) {
        this.nome = nome
        this.preco = preco
    }
}

class Pessoa{
    constructor(nome, taxa) {
        this.nome = nome
        this.valorPago = 0
        this.taxa = taxa
    }
}

class RelacaoProdutoCliente{
    constructor(qnt, nomeProduto, clientes){
        this.nomeProduto = nomeProduto
        this.quantidade = qnt
        this.clientes = clientes
    }
}

/* Listas que conterão os objetos criados pelas respectivas classes */

var listaPessoas = []
var listaProdutos = []
var listaRelacoes = []

/* Adicionar nova pessoa */

const novaPessoa = (nome) => {
    listaPessoas.push(new Pessoa(nome, undefined))
    clients.innerHTML += `
    <div class="client-div">
        <input type="checkbox" value="${nome}" id="${nome}-checkbox" class="client-checkbox">
        <label for="${nome}">${nome}</label>
    </div>
    `
    pedidosDiv.innerHTML += `
    <div class="pedido-header">
        <h3>${nome}</h3>
        <div class="tax-div">
            <input type="checkbox" id="${nome}-taxa" class="checkbox-taxa" data-name="${nome}">
            <label for="${nome}-taxa">Pagar Taxa</label>
        </div>
    </div>
    <div class="pedido-info">
        <ul id="${nome}-foods" class="food-list" data-name="${nome}"></ul>
        <div class="payments">
            <div class="payment">
                <span>R$<span>
                <span class="payment-value" data-name="${nome}">00,00</span>
            </div>
        </div>
    </div>`
}

/* Adicionar novo produto */

const novoProduto = (nome, preco) => {
    listaProdutos.push(new Produto(nome, preco))
    let id = nome.split(' ').join('')
    foods.innerHTML += `
    <div class="product-div">
        <input type="number" id="${id}-qnt" class="productRequestNumber" min="0">
        <label for="${nome}">${nome.replace(/[A-Z]/g, ' $&').trim()} (R$${preco})</label>
        <input type="radio" value="${id}" id="${id}" class="food-radio" name="food-radio" required>
    </div>
    `
    document.querySelector(`#${id}-qnt`).defaultValue = '0'
}

/* Adicionar nova relação (pedido) */

const novaRelacao = (qnt, nomeProduto, clientes) => {
    let count = 0
    if(clientes[0].length > 1){
        listaRelacoes.forEach((relacao) => {
            if(relacao['nomeProduto'] === nomeProduto){
                count += 1
            }
        })
        if(count === 0){
            listaRelacoes.push(new RelacaoProdutoCliente(qnt, nomeProduto, clientes))
        }else {
            listaRelacoes.forEach((relacao) => {
                if(relacao['nomeProduto'] === nomeProduto){
                    relacao['clientes'] = relacao['clientes'].concat(clientes)
                    relacao['quantidade'] = relacao['quantidade'].concat(qnt)
                }
            })
        }
    }
}


/* Funções para calcular os valores */

resetarPagamentos = function(){
    listaPessoas.forEach((pessoa) => {
        pessoa['valorPago'] = 0;
    })
}

calcularPagamentos = function(){
    resetarPagamentos();
    let preco = 0;
    let quantidades = []
    listaRelacoes.forEach((relacao) => {
        listaProdutos.forEach((produto) => {
            if(relacao['nomeProduto'] === produto['nome']){
                preco = produto['preco']
                quantidades = relacao['quantidade']
            }
        })
        for(let i = 0; i < relacao['clientes'].length; i++){    
            relacao['clientes'][i].forEach((cliente) => {
                listaPessoas.forEach((pessoa) => {
                    if(cliente === pessoa['nome']){
                        if(relacao['clientes'][i][0] === "Individual"){
                            pessoa['valorPago'] += (Number(preco) * quantidades[i])
                        }else{
                            pessoa['valorPago'] += ((Number(preco) * quantidades) / (relacao['clientes'][i].length -1))
                        }
                    } 
                })
            })
        }   
    })
}

pagarTaxa = function(){
    let taxaCheckboxes = document.querySelectorAll(".checkbox-taxa")
    taxaCheckboxes.forEach((checkbox) => {
        if(checkbox.checked){
            listaPessoas.forEach((pessoa) => {
                if(checkbox.dataset.name === pessoa['nome']){
                    pessoa['valorPago'] = Number(pessoa['valorPago'] * 1.1).toFixed(2)
                }
            })
        }
    })
}

/* Mostrar resultados para o usuário */

mostrarPedidos = function() {
    let listasPedidos = document.querySelectorAll(".food-list");
    listasPedidos.forEach((lista) => {
        lista.innerHTML = ''
        lista.dataset.name;
        listaRelacoes.forEach((relacao) => {
            let quantidades = []
            listaProdutos.forEach((produto) => {
                if(relacao['nomeProduto'] === produto['nome']){
                    quantidades = relacao['quantidade']
                }
            })
            for(let i = 0; i < relacao['clientes'].length; i++){    
                relacao['clientes'][i].forEach((cliente) => {
                    listaPessoas.forEach((pessoa) => {
                        if(cliente === pessoa['nome']){
                            if(cliente === lista.dataset.name) {
                                if(relacao['clientes'][i][0] === "Individual" && quantidades[i] > 0){
                                    lista.innerHTML += `
                                    <li>
                                        ${quantidades[i]} ${relacao['nomeProduto'].replace(/[A-Z]/g, ' $&').trim()} (Ind)
                                    </li>`
                                }else{
                                    if(quantidades[i] > 0){
                                        lista.innerHTML += `
                                        <li>
                                            ${quantidades[i]} ${relacao['nomeProduto'].replace(/[A-Z]/g, ' $&').trim()} (Comp)
                                        </li>`
                                    }
                                }    
                            }  
                            
                        } 
                    })
                })
            }
        })
    })
}

mostrarValores = function() {
    let payments = document.querySelectorAll(".payment-value")
    payments.forEach((payment) => {
        listaPessoas.forEach((pessoa) => {
            if(payment.dataset.name === pessoa['nome']){
                payment.innerHTML = Number(pessoa['valorPago']).toFixed(2)
            }
        })
    })
}


calcularBtn.addEventListener(("click"), (event) => {
    calcularPagamentos()
    pagarTaxa()
    mostrarValores()
})

/* EventListeners dos formulários (Pessoa, Produto, Relação) */

nameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    novaPessoa(nameInput.value.split(' ').join(''));
    nameInput.value = '';
})

foodForm.addEventListener("submit", (event) => {
    event.preventDefault();

    novoProduto(foodNameInput.value.split(' ').join(''), foodPriceInput.value);
    foodNameInput.value = '';
    foodPriceInput.value = '';
})

relationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let clientCheckboxes = document.querySelectorAll(".client-checkbox")
    let foodRadios = document.querySelectorAll(".food-radio")
    let clientesRelacionados = []
    let food = ''
    let qnt = []

    clientCheckboxes.forEach((checkbox) => {
        if(checkbox.checked){
            clientesRelacionados = clientesRelacionados.concat([checkbox.value])
        }
    })
    if(paymentOptionInput.value === 'Individual'){
        clientesRelacionados.unshift('Individual')
    }else {
        clientesRelacionados.unshift('Compartilhado')
    }
    foodRadios.forEach((radio) => {
        if(radio.checked){
            food = radio.value;
            qnt.push(document.querySelector(`#${radio.id}-qnt`).value)
        }
    })
    novaRelacao(qnt, food, [clientesRelacionados])
    mostrarPedidos();
    relationForm.reset()
})

/* Botões e funções Clear */

const clearInterface = function() {
    listaRelacoes = [];
    mostrarPedidos();
    calcularPagamentos()
    pagarTaxa()
    mostrarValores()
}

const clearClient = function(){
    listaPessoas = [];
    listaRelacoes = []
    clients.innerHTML = ''
    pedidosDiv.innerHTML = '';
}

const clearProduct = function(){
    listaProdutos = []
    foods.innerHTML = ''
    clearInterface();
}

clearInterfaceBtn.addEventListener("click", (event) => {
    clearInterface()
})

clearClientBtn.addEventListener("click", (event) => {
    clearClient()
})

clearProductBtn.addEventListener("click", (event) => {
    clearProduct()
})
