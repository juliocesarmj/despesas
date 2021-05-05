class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    const id = localStorage.getItem('id');

    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }
  getNextId() {
    const nextId = localStorage.getItem('id');
    return parseInt(nextId) + 1;
  }
  gravarLocalStorage(despesa) {
    const id = this.getNextId();
    localStorage.setItem(id, JSON.stringify(despesa));
    localStorage.setItem('id', id);
  }
  recuperarRegistros() {
    const arrDespesas = [];
    let id = localStorage.getItem('id');

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa == null) continue;
      despesa.id = i;
      arrDespesas.push(despesa);
    }
    return arrDespesas;
  }

  pesquisar(d) {
    let despesasFiltradas = [];
    despesasFiltradas = this.recuperarRegistros();
    if (d.ano !== '') {
      despesasFiltradas = despesasFiltradas.filter((f) => f.ano == d.ano);
    }
    if (d.mes !== '') {
      despesasFiltradas = despesasFiltradas.filter((f) => f.mes == d.mes);
    }
    if (d.dia !== '') {
      despesasFiltradas = despesasFiltradas.filter((f) => f.dia == d.dia);
    }
    if (d.tipo !== '') {
      despesasFiltradas = despesasFiltradas.filter((f) => f.tipo == d.tipo);
    }
    if (d.descricao !== '') {
      despesasFiltradas = despesasFiltradas.filter(
        (f) => f.descricao == d.descricao,
      );
    }
    if (d.valor !== '') {
      despesasFiltradas = despesasFiltradas.filter((f) => f.valor == d.valor);
    }
    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}
const bd = new Bd();

function cadastroDespesa() {
  const ano = document.getElementById('ano');
  const mes = document.getElementById('mes');
  const dia = document.getElementById('dia');
  const tipo = document.getElementById('tipo');
  const descricao = document.getElementById('descricao');
  const valor = document.getElementById('valor');

  const despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value,
  );
  if (despesa.validarDados()) {
    //modal successful
    bd.gravarLocalStorage(despesa);
    document.getElementById('titleModal').innerHTML =
      'Registro inserido com sucesso';
    document.getElementById('modalTitulo').className =
      'modal-header text-success';
    document.getElementById('modalBody').innerHTML =
      'Despesa cadastrada com sucesso';
    document.getElementById('fecharModal').className = 'btn btn-success';
    document.getElementById('fecharModal').innerHTML = 'Voltar';
    $('#dialogModal').modal('show');
    limpaInputs();
  } else {
    //modal error
    document.getElementById('titleModal').innerHTML =
      'Erro na inclusão do registro';
    document.getElementById('modalTitulo').className =
      'modal-header text-danger';
    document.getElementById('modalBody').innerHTML =
      'Existem na gravação. Verifique se todos os campos foram preenchidos corretamente';
    document.getElementById('fecharModal').className = 'btn btn-danger';
    document.getElementById('fecharModal').innerHTML = 'Voltar e corrigir';
    $('#dialogModal').modal('show');
  }
}

function limpaInputs() {
  document.getElementById('ano').value = '';
  document.getElementById('mes').value = '';
  document.getElementById('dia').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
}

//página de consulta

function listaDespesas(despesas = [], filtro = false) {
  if (despesas.length == 0 && filtro == false)
    despesas = bd.recuperarRegistros();
  let listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
    switch (d.tipo) {
      case '1':
        d.tipo = 'Alimentação';
        break;
      case '2':
        d.tipo = 'Educação';
        break;
      case '3':
        d.tipo = 'Lazer';
        break;
      case '4':
        d.tipo = 'Saúde';
        break;
      case '5':
        d.tipo = 'Transporte';
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    //botao exclusao
    /*let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.setAttribute('id', `id_despesa_${d.id}`);
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.onclick = function () {
      let id = this.id.replace('id_despesa_', '');
      bd.remover(id);

      document.getElementById('titleModal').innerHTML =
        'Registro excluido com sucesso';
      document.getElementById('modalTitulo').className =
        'modal-header text-success';
      document.getElementById('modalBody').innerHTML =
        'O registro desejado foi removido com sucesso';
      document.getElementById('fecharModal').className = 'btn btn-success';
      document.getElementById('fecharModal').innerHTML = 'Voltar';
      $('#dialogModal').modal('show');
      if (document.getElementById('#dialogModal').style.display == 'none') {
        window.location.reload();
      }
      
    };*/
    linha.insertCell(4);
    let lastLinha = linha.insertCell(5);
    lastLinha.className = 'btn btn-danger';
    lastLinha.id = `id_despesa_${d.id}`;
    lastLinha.innerHTML = '<i class="fas fa-times"></i>';
    lastLinha.onclick = function () {
      let id = this.id.replace('id_despesa_', '');
      bd.remover(id);
      this.parentElement.remove();
      document.getElementById('titleModal').innerHTML =
        'Registro excluido com sucesso';
      document.getElementById('modalTitulo').className =
        'modal-header text-success';
      document.getElementById('modalBody').innerHTML =
        'O registro desejado foi removido com sucesso';
      document.getElementById('fecharModal').className = 'btn btn-success';
      document.getElementById('fecharModal').innerHTML = 'Voltar';
      $('#dialogModal').modal('show');
    };
  });
}
function pesquisarDespesa() {
  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value,
  );

  let despesas = bd.pesquisar(despesa);
  listaDespesas(despesas, true);
}
