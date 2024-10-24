let codigoPedido = 0;
let pedidos = [];

const produtos = [
  { codigo: 101, nome: "One Piece Vol. 1", preco: 19.9 },
  { codigo: 102, nome: "Naruto Vol. 1", preco: 18.5 },
  { codigo: 103, nome: "Dragon Ball Vol. 1", preco: 20.0 },
  { codigo: 104, nome: "Attack on Titan Vol. 1", preco: 22.9 },
  { codigo: 105, nome: "Fullmetal Alchemist Vol. 1", preco: 19.9 },
  { codigo: 106, nome: "Bleach Vol. 1", preco: 21.5 },
  { codigo: 107, nome: "Demon Slayer Vol. 1", preco: 23.0 },
  { codigo: 108, nome: "Death Note Vol. 1", preco: 17.9 },
  { codigo: 109, nome: "My Hero Academia Vol. 1", preco: 24.0 },
  { codigo: 110, nome: "Jujutsu Kaisen Vol. 1", preco: 25.0 },
];

class Produto {
  constructor(codigo, nome, preco) {
    this.codigo = codigo;
    this.nome = nome;
    this.preco = preco;
  }

  toString() {
    return `${this.codigo} - ${this.nome} - R$${this.preco.toFixed(2)}`;
  }
}

class Solicitante {
  constructor(nome, email) {
    this.nome = nome;
    this.email = email;
  }

  toString() {
    return `${this.nome} - ${this.email}`;
  }
}

class Pedido {
  constructor(codigo, solicitante) {
    this.codigo = codigo;
    this.solicitante = solicitante;
    this.produtos = [];
    this.status = "Aberto";
  }

  toString() {
    const listaProdutos = this.produtos
      .reduce((acc, produto) => {
        const existing = acc.find((item) => item.codigo === produto.codigo);
        if (existing) {
          existing.quantidade += 1;
        } else {
          acc.push({
            codigo: produto.codigo,
            nome: produto.nome,
            quantidade: 1,
          });
        }
        return acc;
      }, [])
      .map(
        (produto) =>
          `- ${produto.nome} (Código: ${produto.codigo}) x ${produto.quantidade}`
      )
      .join("\n");

    return `[${this.status}] Pedido ${
      this.codigo
    } - Solicitante: ${this.solicitante.toString()}\nProdutos:\n${listaProdutos}`;
  }

  incluir() {
    pedidos.push(this);
  }

  alterarStatus(novoStatus) {
    this.status = novoStatus;
  }

  addProduto(produto) {
    this.produtos.push(produto);
  }

  removeProduto(codigoProduto) {
    const index = this.produtos.findIndex(
      (produto) => produto.codigo == codigoProduto
    );

    if (index != -1) {
      this.produtos.splice(index, 1);
    } else {
      console.log("Produto não identificado");
    }
  }
}

function criarPedido() {
  const nome = document.getElementById("nomeSolicitante").value;
  const email = document.getElementById("emailSolicitante").value;

  if (!nome || !email) {
    alert("Por favor, preencha o nome e o e-mail do solicitante.");
    return;
  }

  const solicitante = new Solicitante(nome, email);
  const pedido = new Pedido(++codigoPedido, solicitante);

  adicionarProdutoAoPedido(pedido);

  pedido.incluir();
  exibirPedidosHTML();
}

function adicionarProdutoAoPedido(pedido) {
  while (true) {
    const codigoProduto = prompt("Código do produto:");
    if (!codigoProduto) break;

    const produto = produtos.find((p) => p.codigo == codigoProduto);
    if (!produto) {
      alert("Produto não encontrado.");
      continue;
    }

    const quantidade = prompt("Quantidade:");
    if (!quantidade) break;

    for (let i = 0; i < quantidade; i++) {
      pedido.addProduto(
        new Produto(produto.codigo, produto.nome, produto.preco)
      );
    }

    const continuar = prompt(
      "Adicionar mais produtos? (sim/não)"
    ).toLowerCase();
    if (continuar !== "sim") break; //sair dá na mesma que falar não
  }

  exibirPedidosHTML();
}

function exibirPedidosHTML() {
  const pedidosDiv = document.getElementById("pedidos");
  pedidosDiv.textContent = pedidos
    .map((pedido) => pedido.toString())
    .join("\n\n");
}

function editarPedido() {
  const codigo = prompt("Código do pedido a ser editado:");
  const pedido = pedidos.find((p) => p.codigo == codigo);

  if (!pedido) {
    alert("Pedido não encontrado.");
    return;
  }

  const acao = prompt(
    "Digite 'adicionar' para adicionar produto ou 'excluir' para remover produto:"
  ).toLowerCase();

  if (acao === "adicionar" || acao === "excluir") {
    const codigoProduto = prompt("Código do produto:");
    const quantidade = parseInt(prompt("Quantidade:"), 10);

    if (acao === "adicionar") {
      const produto = produtos.find((p) => p.codigo == codigoProduto);
      if (produto) {
        for (let i = 0; i < quantidade; i++) {
          pedido.addProduto(
            new Produto(produto.codigo, produto.nome, produto.preco)
          );
        }
        alert("Produto adicionado com sucesso.");
      } else {
        alert("Produto não encontrado.");
      }
    } else if (acao === "excluir") {
      for (let i = 0; i < quantidade; i++) {
        pedido.removeProduto(codigoProduto);
      }
      alert("Produto excluído com sucesso.");
    } else {
      alert("Ação inválida.");
    }
  } else {
    alert("Ação inválida.");
  }

  exibirPedidosHTML();
}

function alterarStatusPedidoHTML() {
  const codigo = prompt("Código do pedido para alterar o status:");
  const pedido = pedidos.find((p) => p.codigo == codigo);

  if (pedido) {
    const novoStatus = prompt(
      "Digite o novo status (aberto, em andamento, finalizado):"
    ).toLowerCase();
    if (["aberto", "em andamento", "finalizado"].includes(novoStatus)) {
      pedido.alterarStatus(novoStatus);
      exibirPedidosHTML();
    } else {
      alert("Status inválido.");
    }
  } else {
    alert("Pedido não encontrado.");
  }
}

function excluirPedido() {
  const codigo = prompt("Código do pedido a ser excluído:");
  const index = pedidos.findIndex((p) => p.codigo == codigo);

  if (index !== -1) {
    pedidos.splice(index, 1);
    exibirPedidosHTML();
  } else {
    alert("Pedido não encontrado.");
  }
}
