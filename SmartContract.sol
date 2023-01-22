// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductSale {
    // Armazena os contratos criados pela fábrica
    mapping(address => Product) public products;

    // Evento emitido quando um novo contrato é criado
    event NewProduct(address indexed productAddress);

    // Função para criar um novo contrato de produto
    function createProduct(string memory name, uint price) public {
        // Cria um novo contrato de produto
        Product newProduct = new Product(name, price);
        // Armazena o endereço do novo contrato na fábrica
        products[address(newProduct)] = newProduct;
        // Emite o evento de novo contrato criado
        emit NewProduct(address(newProduct));
    }

    // Função para interagir com um contrato de produto específico
    function purchaseProduct(address productAddress) public payable {
        // Recupera o contrato de produto pelo endereço
        // Product storage product = products[productAddress];
        Product product = products[productAddress];
        // Verifica se o preço da transação é suficiente
        // require(msg.value >= product.price);
        require(msg.value >= product.price());
        // Transfere o valor da transação para o vendedor
        payable(product.seller()).transfer(msg.value);
    }
}

// Contrato de Produto
contract Product {
    string public name;
    uint public price;
    address public seller;

    constructor(string memory _name, uint _price) {
        name = _name;
        price = _price;
        seller = msg.sender;
    }
}
