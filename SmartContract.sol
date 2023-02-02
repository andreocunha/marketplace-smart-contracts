// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Product {
    // Variáveis públicas do produto, incluindo o nome, descrição, preço, URL da imagem, vendedor e comprador
    string public name;
    string public description;
    uint256 public price;
    string public imageUrl;
    address payable public seller;
    address public buyer;
    bool public sold;
    
    // Construtor inicializando as variáveis do produto com os valores fornecidos
    constructor(string memory _name, string memory _description, uint256 _price, string memory _imageUrl, address payable _seller) {
        name = _name;
        description = _description;
        price = _price;
        imageUrl = _imageUrl;
        seller = _seller;
        sold = false;
    }
    
    // Evento para indicar o pagamento
    event Paid();
    
    // Função para comprar o produto
    function buyProduct(address _buyer) payable external {
        // Verifica se o produto já foi vendido
        require(!sold, "Produto ja vendido");
        // Verifica se o valor enviado é suficiente para comprar o produto
        require(msg.value >= price, "Valor insuficiente");
        
        // Atribui o comprador
        buyer = _buyer;
        sold = true;
        
        // Transfere o pagamento para o vendedor
        payable(seller).transfer(address(this).balance);
        // Emite o evento Paid
        emit Paid();
    }
}


// Este contrato é uma fábrica de contratos de produtos que permite a criação, listagem e remoção de contratos de produtos.
contract ProductFactory {
    // Array para armazenar endereços de contratos de produto criados
    address[] public products;

    // Evento que é emitido ao criar um novo contrato de produto
    event ProductCreated(address indexed productAddress);

    // Função para criar um novo contrato de produto
    function createProduct(string memory _name, string memory _description, uint256 _price, string memory _imageUrl, address payable _seller) public {
        // Cria um novo contrato de produto
        address newProduct = address(new Product(_name, _description, _price, _imageUrl, _seller));
        // Adiciona o endereço do novo contrato ao array de contratos
        products.push(newProduct);
        // Emite o evento ProductCreated com o endereço do novo contrato
        emit ProductCreated(newProduct);
    }

    // Função para obter os endereços de todos os contratos de produto criados
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

    // Função para deletar um contrato de produto específico
    function deleteProduct(address _productAddress) public {
        // Verifica se o endereço do vendedor corresponde ao remetente da transação
        Product product = Product(_productAddress);
        require(address(msg.sender) == product.seller(), "Apenas o vendedor pode deletar o produto");

        // Remove o produto do array de produtos
        uint256 productIndex;
        for (uint256 i = 0; i < products.length; i++) {
            if (products[i] == _productAddress) {
                productIndex = i;
                break;
            }
        }

        // Cria uma nova lista com todos os endereços, exceto o endereço que você deseja deletar
        address[] memory newProducts = new address[](products.length - 1);
        for (uint256 i = 0; i < productIndex; i++) {
            newProducts[i] = products[i];
        }
        for (uint256 i = productIndex + 1; i < products.length; i++) {
            newProducts[i - 1] = products[i];
        }

        products = newProducts;
    }

    function getProductsBySeller(address _seller) public view returns (address[] memory) {
        // Criar uma lista para armazenar endereços de contratos vendidos pelo usuário
        address[] memory soldProducts;
        uint256 soldProductCount = 0;
        // Percorra a lista de contratos de produto
        for (uint256 i = 0; i < products.length; i++) {
            // Verificar se o vendedor do contrato corresponde ao usuário dado
            Product product = Product(products[i]);
            if (product.seller() == _seller) {
                // Adicionar o endereço do contrato à lista de vendas
                soldProducts[soldProductCount] = products[i];
                soldProductCount++;
            }
        }
        // Retorna a lista de contratos vendidos pelo usuário
        return soldProducts;
    }

    function getProductsByBuyerOrSeller(address _user) public view returns (address[] memory) {
        // Criar uma lista para armazenar endereços de contratos vendidos ou comprados pelo usuário
        address[] memory productsByUser;
        uint256 productCount = 0;
        // Percorra a lista de contratos de produto
        for (uint256 i = 0; i < products.length; i++) {
            // Verificar se o vendedor ou comprador do contrato corresponde ao usuário dado
            Product product = Product(products[i]);
            if ((product.seller() == _user || product.buyer() == _user) && product.sold()) {
                // Adicionar o endereço do contrato à lista de vendas ou compras
                productsByUser[productCount] = products[i];
                productCount++;
            }
        }
        // Retorna a lista de contratos vendidos ou comprados pelo usuário
        return productsByUser;
    }
}