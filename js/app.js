
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false;
			}
		}
		return true
	}
}

class Bd{
	constructor(){
		let id = localStorage.getItem('id');

		if(id === null){
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}
	
	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id , JSON.stringify(d));
		
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){
	 let despesas = []
	 let id = localStorage.getItem('id')

		//Recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))
			

			if( despesa === null){
				continue
			}
			despesa.id = i
			
			despesas.push(despesa)
		}
	 return despesas
	}

	pesquisar(despesa){
		let despesasFiltradas = []
		despesasFiltradas = this.recuperarTodosRegistros()

		if(despesa.ano != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano )
		}
		if(despesa.mes != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes )
		}
		if(despesa.dia != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia )
		}
		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo )
		}
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao )
		}
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor )
		}
		return despesasFiltradas;
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa(){
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value;
	let valor = document.getElementById('valor').value;


	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

	if (despesa.validarDados()){
		bd.gravar(despesa);

		document.getElementById('titulo-modal').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		$('#modalAvisos').modal('show')

		ano = document.getElementById('ano').value = '';
		mes = document.getElementById('mes').value = '';
		dia = document.getElementById('dia').value = '';
		tipo = document.getElementById('tipo').value = '';
		descricao = document.getElementById('descricao').value = '';
		valor = document.getElementById('valor').value = '';

	}else{
		document.getElementById('titulo-modal').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalAvisos').modal('show')
	}
}


function carregarListaDespesas(despesas = [], filtro = false){

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}
	despesas = bd.recuperarTodosRegistros()

	let listaDespesas = document.getElementById('carregaListaDespesas')
	listaDespesas.innerHTML = ''
	despesas.forEach(function(d){
		let linha = listaDespesas.insertRow()
		switch(d.tipo){
			case '1': d.tipo = "Alimentação"
				break
			case '2': d.tipo = "Educação"
				break
			case '3': d.tipo = "Lazer"
				break
			case '4': d.tipo = "Saúde"
				break
			case '5': d.tipo = "Transporte"
				break
			
		}

		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"><i>'
		btn.id = `${d.id}`
		btn.onclick = function() {
			bd.remover(this.id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
	})
}
function pesquisarDespesa(){
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value;
	let valor = document.getElementById('valor').value;

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	
	let despesas = bd.pesquisar(despesa)

	this.carregarListaDespesas(despesas, true)
	
}