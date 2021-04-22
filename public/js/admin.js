import {
    variables
} from './globalvars.js'



window.editar = function editar() {
	variables.teste = document.getElementById("edtOrigem1").value;
	variables.origem1 = document.getElementById("edtOrigem1").value;
	variables.destino1 = document.getElementById("edtDestino1").value;
	variables.origem2 = document.getElementById("edtOrigem2").value;
	variables.destino2 = document.getElementById("edtDestino2").value;
	variables.origem3 = document.getElementById("edtOrigem3").value;
	variables.destino3 = document.getElementById("edtDestino3").value;
	
	alert('Modificado com sucesso !');

}