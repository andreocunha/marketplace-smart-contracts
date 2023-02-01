// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Product {
    string public name;
    string public description;
    uint256 public price;
    string public imageUrl;
    address payable public seller;
    address public buyer;
    bool public sold;

    constructor(string memory _name, string memory _description, uint256 _price, string memory _imageUrl, address payable _seller) {
        name = _name;
        description = _description;
        price = _price;
        imageUrl = _imageUrl;
        seller = _seller;
        sold = false;
    }

    event Paid();

    function buyProduct(address _buyer) payable external {
        require(!sold, "Produto ja vendido");
        require(msg.value >= price, "Valor insuficiente");

        buyer = _buyer;
        sold = true;

        // seller.transfer(price);
        payable(seller).transfer(address(this).balance);
        emit Paid();
    }
}

contract ProductFactory {
    address[] public products;

    event ProductCreated(address indexed productAddress);

    function createProduct(string memory _name, string memory _description, uint256 _price, string memory _imageUrl, address payable _seller) public {
        address newProduct = address(new Product(_name, _description, _price, _imageUrl, _seller));
        products.push(newProduct);
        emit ProductCreated(newProduct);
    }

    function getProductAddresses() public view returns (address[] memory) {
        return products;
    }

    // Função para obter os dados de um contrato de produto específico
    function getProduct(address _productAddress) public view returns (string memory, string memory, uint256, string memory, address, address, bool) {
        // Verifica se há contratos criados
        require(products.length > 0, "Nao ha contrato criado ainda");
        // Cria uma instância do contrato de produto
        Product product = Product(_productAddress);
        // Retorna os dados do contrato
        return (product.name(), product.description(), product.price(), product.imageUrl(), product.seller(), product.buyer(), product.sold());
    }
}
