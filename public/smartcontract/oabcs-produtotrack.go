/**
 *
 */
package main

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"math/big"
	"time"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

//antigo trackposition
type ProdutoTrack struct {
//Tudo string, mas basta fazer o tratamento adequado no app
	Teste string `json:"Teste"`
	IdProduto string `json:"IdProduto"`
	Quantidade string `json:"Quantidade"`
	Origem string `json:"Origem"`
	LatOrigem string `json:"LatOrigem"`
	LongOrigem string `json:"LongOrigem"`
	Material string `json:"Material"`
	Destino string `json:"Destino"`
	LatDest string `json:"LatDest"`
	LongDest string `json:"LongDest"`
	TimeEvent string `json:"TimeEvent"`
}

func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	} else {
                fmt.Printf("Success creating new Smart Contract")
        }
}

/**
 *
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil);
}

/**
 *
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger appropriately
    if function == "addEvent" {
		return s.addEvent(APIstub)
	} else if function == "queryEvent"{
		return s.queryEvent(APIstub,args)
	}
	
	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryEvent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	//   0
	// "queryString"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) addEvent(APIstub shim.ChaincodeStubInterface) sc.Response {
	_, args := APIstub.GetFunctionAndParameters()

	if len(args) != 10 {
		return shim.Error("Incorrect number of arguments for event. Expecting 10")
	};
	teste := args[0]
	if teste == "" {
		return shim.Error("Invalid value for parameter teste.")
	}
	idproduto := args[1]
	if idproduto == "" {
		return shim.Error("Invalid value for parameter idproduto.")
	}
	quantidade := args[2]
	if quantidade == "" {
		return shim.Error("Invalid value for parameter quantidade.")
	}
	origem := args[3]
	if origem == "" {
		return shim.Error("Invalid value for parameter origem.")
	}
	latOrigem := args[4]
	if latOrigem == "" {
		return shim.Error("Invalid value for parameter latOrigem.")
	}
	longOrigem := args[5]
	if longOrigem == "" {
		return shim.Error("Invalid value for parameter longOrigem.")
	}
	material := args[6]
	if material == "" {
		return shim.Error("Invalid value for parameter material.")
	}
	destino := args[7]
	if destino == "" {
		return shim.Error("Invalid value for parameter destino.")
	}
	latDest := args[8]
	if latDest == "" {
		return shim.Error("Invalid value for parameter latDest.")
	}
	longDest := args[9]
	if longDest == "" {
		return shim.Error("Invalid value for parameter longDest.")
	}
	
	errorMsg := registerEvent(APIstub,teste,idproduto,quantidade,origem,latOrigem,longOrigem,material,destino,latDest,longDest)
	if errorMsg != "" {
		return shim.Error(errorMsg)
	}
	return shim.Success(nil);
}



func registerEvent(APIstub shim.ChaincodeStubInterface, teste string, idproduto string, quantidade string, origem string, latOrigem string, longOrigem string, material string, destino string, latDest string, longDest string) (string) {
	time1 := time.Now()
	//time1 := "tempo"
	newPosition := ProdutoTrack{Teste: teste, IdProduto: idproduto, Quantidade: quantidade, Origem: origem, LatOrigem: latOrigem, LongOrigem: longOrigem, Material: material, Destino: destino, LatDest: latDest, LongDest: longDest, TimeEvent: time1.String()}
	positionEncoded, _ := json.Marshal(newPosition)
	err := APIstub.PutState(APIstub.GetTxID(), positionEncoded)
	if err != nil {
		return fmt.Sprintf("Failed to register" , "-")
	}

	return ""
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string)([] byte, error) {
    fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)
    resultsIterator, err := stub.GetQueryResult(queryString)
    defer resultsIterator.Close()
    if err != nil {
        return nil, err
    }
    // buffer is a JSON array containing QueryRecords
    var buffer bytes.Buffer
    buffer.WriteString("[")
    bArrayMemberAlreadyWritten := false
    for resultsIterator.HasNext() {
        queryResponse,
        err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }
        // Add a comma before array members, suppress it for the first array member
        if bArrayMemberAlreadyWritten == true {
            buffer.WriteString(",")
        }
        buffer.WriteString("{\"Key\":")
        buffer.WriteString("\"")
        buffer.WriteString(queryResponse.Key)
        buffer.WriteString("\"")
        buffer.WriteString(", \"Record\":")
        // Record is a JSON object, so we write as-is
        buffer.WriteString(string(queryResponse.Value))
        buffer.WriteString("}")
        bArrayMemberAlreadyWritten = true
    }
    buffer.WriteString("]")
    fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())
    return buffer.Bytes(), nil
}

func cryptoVerify(hash []byte, publicKeyBytes []byte, r *big.Int, s *big.Int) (result bool) {
	fmt.Println("- Verifying ECDSA signature")
	fmt.Println("Message")
	fmt.Println(hash)
	fmt.Println("Public Key")
	fmt.Println(publicKeyBytes)
	fmt.Println("r")
	fmt.Println(r)
	fmt.Println("s")
	fmt.Println(s)

	publicKey, err := x509.ParsePKIXPublicKey(publicKeyBytes)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	switch publicKey := publicKey.(type) {
	case *ecdsa.PublicKey:
		return ecdsa.Verify(publicKey, hash, r, s)
	default:
		return false
	}
}

