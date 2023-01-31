// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Contrato principal responsável por criar contratos de produtos
contract ContractFactory {
    // Array para armazenar os endereços dos contratos de produtos criados
    address[] public createdContracts;

    event ProductCreated(address indexed productAddress);

    // Função para criar um novo contrato de produto
    function createProductContract(string memory _name, string memory _description, uint256 _amount, string memory _imageUrl, address payable _seller) public {
        // Cria uma nova instância do contrato de produto
        address contractAddress = address(new Product(_name, _description, _amount, _imageUrl, _seller));
        // Adiciona o endereço do novo contrato criado no array
        createdContracts.push(contractAddress);
        emit ProductCreated(contractAddress);
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
    function getProduct(address _productAddress) public view returns (string memory, string memory, uint256, string memory, address, address, bool) {
        // Verifica se há contratos criados
        require(createdContracts.length > 0, "Nao ha contrato criado ainda");
        // Cria uma instância do contrato de produto
        Product product = Product(_productAddress);
        // Retorna os dados do contrato
        return (product.name(), product.description(), product.price(), product.imageUrl(), product.seller(), product.buyer(), product.sold());
    }

    function buy(address _productAddress) public payable {
        // Verifica se há contratos criados
        require(createdContracts.length > 0, "Nao ha contrato criado ainda");
        // Verifica se o endereço do contrato está presente na lista de contratos criados
        require(contains(_productAddress), "Produto nao encontrado");
        // Cria uma instância do contrato de produto
        Product product = Product(_productAddress);
        // Chama a função buyProduct() no contrato de produto
        product.buyProduct();
    }

        // Função auxiliar para verificar se o endereço do contrato está presente na lista de contratos criados
    function contains(address _productAddress) private view returns (bool) {
        for (uint i = 0; i < createdContracts.length; i++) {
            if (createdContracts[i] == _productAddress) {
                return true;
            }
        }
        return false;
    }

}

contract Product {
    string public name;
    string public description;
    uint256 public price;
    string public imageUrl;
    address payable public seller;
    address public buyer;
    bool public sold;

    // Construtor do contrato
    constructor(string memory _name, string memory _description, uint256 _amount, string memory _imageUrl, address payable _seller) {
        name = _name;
        description = _description;
        price = _amount;
        imageUrl = _imageUrl;
        seller = _seller;
    }

    function buyProduct() public payable {
        // Verifica se o contrato foi vendido
        require(!sold, "Produto ja vendido");
        // Verifica se o comprador está enviando o valor correto
        require(msg.value == price, "Valor invalido");
        // Atribui o comprador ao contrato
        buyer = msg.sender;
        // Marca o contrato como vendido
        sold = true;
        // Transfere o valor para o vendedor
        seller.transfer(msg.value);
    }
}
