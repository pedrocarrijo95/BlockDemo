import {
    variables
} from './globalvars.js'

var teste = variables.teste;
var origem1 = variables.origem1;
var destino1 = variables.destino1;
var destino2 = variables.destino2;
var destino3 = variables.destino3;

document.getElementById("op1").innerHTML = origem1.charAt(0).toUpperCase() + origem1.slice(1);
document.getElementById("op2").innerHTML = destino1.charAt(0).toUpperCase() + destino1.slice(1);
document.getElementById("op3").innerHTML = destino2.charAt(0).toUpperCase() + destino2.slice(1);

const myLatLngFazenda = {
    lat: -23.6239823,
    lng: -46.6976914
};
const myLatLngFabrica = {
    lat: -23.6256798,
    lng: -46.6931636
};
const myLatLngDistribuidora = {
    lat: -23.6271319,
    lng: -46.688082
};
window.buscarLocal = async function buscarLocal() {
    var localAtual = "";
    var histlocal = "";
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cGVkcm8uYmxvY2tjaGFpbjpCbG9jayYxMjM0NTY3ODk=");
    myHeaders.append("Content-Type", "application/json");


    var idproduto = document.getElementById("edtIdproduto").value;


    var raw = "";
    raw = JSON.stringify({
        "channel": "trackchannel",
        "chaincode": "oabcs-produtotrack",
        "chaincodeVer": "v3",
        "method": "queryEvent",
        "args": ["{\"selector\":{\"Teste\":\"" + teste + "\",\"IdProduto\":\"" + idproduto + "\"}}"]
    });




    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    document.getElementById('txtRes').innerHTML = "";
    alert('Rastreando..');
    fetch("https://blockhubiteam-ladcsteam-iad.blockchain.ocp.oraclecloud.com:7443/restproxy/bcsgw/rest/v1/transaction/query", requestOptions)
        .then(response => response.text())
        .then(result => {
            var rs = JSON.parse(result.toString());
            var objrs = rs.result.payload;
            if (objrs.length > 0) {
                for (var i = 0; i < objrs.length; i++) {
                    var idproduto = objrs[i].Record.IdProduto;
                    var origem = objrs[i].Record.Origem;
                    var material = objrs[i].Record.Material;
                    var destino = objrs[i].Record.Destino;
                    var timeEvent = objrs[i].Record.TimeEvent;
                    if (destino == destino1) {
                        localAtual = destino1;
                        histlocal = origem1 + " -> " + localAtual;
                    } else if (destino == destino2) {
                        localAtual = destino2;
                        histlocal += " -> " + localAtual;
                    } else if (destino == destino3) {
                        localAtual = destino3;
                        histlocal += " -> " + localAtual;
                    }
                    if (i == (objrs.length - 1)) {
                        document.getElementById('txtRes').innerHTML = histlocal;
						var qtdLocais = objrs.length;
						console.log("qtdLocais: "+i);
						document.getElementById('iframeid').src = "http://129.213.202.34:3000/graph?qtdLocais="+qtdLocais;
						document.getElementById('iframeid').style.display = "block";
                        addMarks(localAtual);
                    }
                }
            } else {
                alert('Produto não encontrado !');
            }


        })
        .catch(error => console.log('error', error));




}

var map;
window.initMap = function () {
	
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: myLatLngFazenda,
    });

}

window.addMarks = function addMarks(local) {

    var labelFazenda = origem1;
    var labelFabrica = destino1;
    var labelDistribuidora = destino2;

    var centerLatLng = myLatLngFazenda;
    if (local == destino1) {
        labelFabrica = labelFabrica + "(Localizacão atual !!)"
        centerLatLng = myLatLngFabrica;
    } else if (local == destino2) {
        labelDistribuidora = labelDistribuidora + "(Localizacão atual !!)"
        centerLatLng = myLatLngDistribuidora;
    } else if (local == destino3) {
        labelDistribuidora = labelDistribuidora + "(Enviado aos " + destino3 + " !!)";
        centerLatLng = myLatLngDistribuidora;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 19,
        center: centerLatLng,
    });
    new google.maps.Marker({
        position: myLatLngFazenda,
        icon: {
            url: "../css/iconfarm.png",
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        },
        map,
        label: {
            color: 'white',
            fontWeight: 'bold',
            text: labelFazenda,
        },
    });
    new google.maps.Marker({
        position: myLatLngFabrica,
        icon: {
            url: "../css/iconfactory.png",
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        },
        map,
        label: {
            color: 'white',
            fontWeight: 'bold',
            text: labelFabrica,
        },
    });
    new google.maps.Marker({
        position: myLatLngDistribuidora,
        icon: {
            url: "../css/icontruck.png",
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        },
        map,
        label: {
            color: 'white',
            fontWeight: 'bold',
            text: labelDistribuidora,
        },
    });
}