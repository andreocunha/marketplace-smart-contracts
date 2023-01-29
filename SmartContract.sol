// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Contrato principal responsável por criar contratos de produtos
contract ContractFactory {
    // Array para armazenar os endereços dos contratos de produtos criados
    address[] public createdContracts;

    // Função para criar um novo contrato de produto
    function createProductContract(string memory _name, string memory _description, string memory _price, string memory _imageUrl, address _seller) public {
        // Cria uma nova instância do contrato de produto
        address contractAddress = address(new Product(_name, _description, _price, _imageUrl, _seller));
        // Adiciona o endereço do novo contrato criado no array
        createdContracts.push(contractAddress);
    }

    // Função para obter todos os contratos de produtos criados
    function getAllProducts() public view returns (Product[] memory) {
        // Verifica se há contratos criados
        require(createdContracts.length > 0, "Nao ha contrato criado ainda");
        // Cria um array para armazenar as instâncias dos contratos
        Product[] memory products = new Product[](createdContracts.length);
        for (uint i = 0; i < createdContracts.length; i++) {
            // Adiciona a instância do contrato no array
            products[i] = Product(createdContracts[i]);
        }
        // Retorna o array de instâncias de contratos
        return products;
    }

    // Função para obter os dados de um contrato de produto específico
    function getProduct(address _productAddress) public view returns (string memory, string memory, string memory, string memory, address, address, bool) {
        // Verifica se há contratos criados
        require(createdContracts.length > 0, "Nao ha contrato criado ainda");
        // Cria uma instância do contrato de produto
        Product product = Product(_productAddress);
        // Retorna os dados do contrato
        return (product.name(), product.description(), product.price(), product.imageUrl(), product.seller(), product.buyer(), product.sold());
    }
}

contract Product {
    string public name;
    string public description;
    string public price;
    string public imageUrl;
    address public seller;
    address public buyer;
    bool public sold;

    // Construtor do contrato
    constructor(string memory _name, string memory _description, string memory _price, string memory _imageUrl, address _seller) {
        name = _name;
        description = _description;
        price = _price;
        imageUrl = _imageUrl;
        seller = _seller;
    }

    // Função para vender o produto
    function sell(address _buyer) public {
        require(msg.sender == seller && !sold);
        buyer = _buyer;
        sold = true;
    }
}
