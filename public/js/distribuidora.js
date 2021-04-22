import {
    variables
} from './globalvars.js'

var teste = variables.teste;
var origem1 = variables.origem1;
var destino1 = variables.destino1;
var destino2 = variables.destino2;

document.getElementById("htitulo").innerHTML = "Rastreabilidade Blockchain - "+destino2.charAt(0).toUpperCase() + destino2.slice(1);
document.getElementById("op1").innerHTML = origem1.charAt(0).toUpperCase() + origem1.slice(1);
document.getElementById("op2").innerHTML = destino1.charAt(0).toUpperCase() + destino1.slice(1);
document.getElementById("op3").innerHTML = destino2.charAt(0).toUpperCase() + destino2.slice(1);
var textStatus = document.getElementById("textStatus");

window.cadastrar = function cadastrar() {
    
    textStatus.innerHTML = "Enviando..";
    textStatus.style.color = "#FFFF00";
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cGVkcm8uYmxvY2tjaGFpbjpCbG9jayYxMjM0NTY3ODk=");
    myHeaders.append("Content-Type", "application/json");




    var origem = variables.origem3;
    var latOrig = "-23.6271319";
    var longOrig = "-46.688082";

    var destino = variables.destino3;
    var latDest = " ";
    var longDest = " ";

    var idproduto = (document.getElementById('edtIdproduto').value).toString();
    var material = (document.getElementById('edtMaterial').value).toString();
    var quantidade = (document.getElementById('edtQuantidade').value).toString();

    var raw = JSON.stringify({
        "channel": "produtotrackchannel",
        "chaincode": "oabcs-produtotrack",
        "chaincodeVer": "v4",
        "method": "addEvent",
        "args": [teste, idproduto, quantidade, origem, latOrig, longOrig, material, destino, latDest, longDest]
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
    textStatus.innerHTML = "Enviado.";
    textStatus.style.color = "#9ACD32"

}

window.buscar = async function buscar() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cGVkcm8uYmxvY2tjaGFpbjpCbG9jayYxMjM0NTY3ODk=");
    myHeaders.append("Content-Type", "application/json");

    var dest = variables.origem3;

    var raw = "";
    raw = JSON.stringify({
        "channel": "produtotrackchannel",
        "chaincode": "oabcs-produtotrack",
        "chaincodeVer": "v4",
        "method": "queryEvent",
        "args": ["{\"selector\":{\"Teste\":\"" + teste + "\",\"Destino\":\"" + dest + "\"}}"]
    });




    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    textStatus.innerHTML = "Buscando..";
    textStatus.style.color = "#FFFF00";
    document.getElementById('txtRes').innerHTML = "";
    fetch("https://blockhubiteam-ladcsteam-iad.blockchain.ocp.oraclecloud.com:7443/restproxy/bcsgw/rest/v1/transaction/query", requestOptions)
        .then(response => response.text())
        .then(result => {
            var rs = JSON.parse(result.toString());
            var objrs = rs.result.payload;
            for (var i = (objrs.length-1); i >= 0 ; i--) {
                var idproduto = objrs[i].Record.IdProduto;
                var origem = objrs[i].Record.Origem;
                var material = objrs[i].Record.Material;
                var quantidade = objrs[i].Record.Quantidade;


                //Tratamento da Data e horario de envio
                var timeEvent = objrs[i].Record.TimeEvent;
                var timeEventSliced = timeEvent.slice(0,19);
                console.log(timeEventSliced);
                var datetime = Date.parse(timeEventSliced);
                var dt = new Date(datetime);
                var day = getDateDigits(dt.getDate(),false);
                var month = getDateDigits(dt.getMonth(),true);
                var hours = getDateDigits(dt.getHours(),false);
                var minutes = getDateDigits(dt.getMinutes(),false);
                var seconds = getDateDigits(dt.getSeconds(),false);
                var dateformated = day+"/"+month+"/"+dt.getFullYear()+" - "+hours+":"+minutes+":"+seconds;

                document.getElementById('txtRes').innerHTML += "<br>" + (i + 1) + "." + "<br>IdProduto: " + idproduto + "<br>Origem: " + origem + "<br>Material: " + material + "<br>Quantidade: " + quantidade + "<br>Horário do envio: " + dateformated + "<br>";
            }


        })
        .catch(error => console.log('error', error));
        textStatus.innerHTML = "Sucesso.";
        textStatus.style.color = "#9ACD32"

}

function getDateDigits(dateinfo,month) {
    var infodate = dateinfo;
    if(month){
        infodate += 1;
    }
    return infodate < 10 ? '0' + infodate : '' + infodate; // ('' + daymonth) for string result
} 