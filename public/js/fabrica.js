import {
    variables
} from './globalvars.js'

var teste = variables.teste;
var origem1 = variables.origem1;
var destino1 = variables.destino1;
var destino2 = variables.destino2;

document.getElementById("htitulo").innerHTML = "Rastreabilidade Blockchain - "+destino1.charAt(0).toUpperCase() + destino1.slice(1);
document.getElementById("op1").innerHTML = origem1.charAt(0).toUpperCase() + origem1.slice(1);
document.getElementById("op2").innerHTML = destino1.charAt(0).toUpperCase() + destino1.slice(1);
document.getElementById("op3").innerHTML = destino2.charAt(0).toUpperCase() + destino2.slice(1);

window.cadastrar = function cadastrar() {
    alert('Enviando..');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cGVkcm8uYmxvY2tjaGFpbjpCbG9jayYxMjM0NTY3ODk=");
    myHeaders.append("Content-Type", "application/json");




    var origem = variables.origem2;
    var latOrig = "-23.6256798";
    var longOrig = "-46.6931636";

    var destino = variables.destino2
    var latDest = "-23.6271319";
    var longDest = "-46.688082";

    var idproduto = (document.getElementById('edtIdproduto').value).toString();
    var material = (document.getElementById('edtMaterial').value).toString();

    var raw = JSON.stringify({
        "channel": "trackchannel",
        "chaincode": "oabcs-produtotrack",
        "chaincodeVer": "v3",
        "method": "addEvent",
        "args": [teste, idproduto, origem, latOrig, longOrig, material, destino, latDest, longDest]
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://blockhubiteam-ladcsteam-iad.blockchain.ocp.oraclecloud.com:7443/restproxy/bcsgw/rest/v1/transaction/invocation", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    alert('Enviado');

}

window.buscar = async function buscar() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cGVkcm8uYmxvY2tjaGFpbjpCbG9jayYxMjM0NTY3ODk=");
    myHeaders.append("Content-Type", "application/json");

    var dest = variables.origem2;

    var raw = "";
    raw = JSON.stringify({
        "channel": "trackchannel",
        "chaincode": "oabcs-produtotrack",
        "chaincodeVer": "v3",
        "method": "queryEvent",
        "args": ["{\"selector\":{\"Teste\":\"" + teste + "\",\"Destino\":\"" + dest + "\"}}"]
    });




    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    alert('Buscando..');
    document.getElementById('txtRes').innerHTML = "";
    fetch("https://blockhubiteam-ladcsteam-iad.blockchain.ocp.oraclecloud.com:7443/restproxy/bcsgw/rest/v1/transaction/query", requestOptions)
        .then(response => response.text())
        .then(result => {
            var rs = JSON.parse(result.toString());
            var objrs = rs.result.payload;
            for (var i = 0; i < objrs.length; i++) {
                var idproduto = objrs[i].Record.IdProduto;
                var origem = objrs[i].Record.Origem;
                var material = objrs[i].Record.Material;
                var timeEvent = objrs[i].Record.TimeEvent;
                document.getElementById('txtRes').innerHTML += "<br>" + (i + 1) + "." + "<br>IdProduto: " + idproduto + "<br>Origem: " + origem + "<br>Material: " + material + "<br>Horário do envio: " + timeEvent + "<br>";
            }


        })
        .catch(error => console.log('error', error));


}