const Produto = require('../models/Produto');

// Função para obter um produto pelo ID
exports.getProdutoById = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        res.render('produtos/produto-detalhe', { produto }); // Certifique-se de que o arquivo 'produto-detalhe.ejs' existe
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        res.status(500).send('Erro ao buscar produto por ID');
    }
};

// Função para obter produtos por categoria
exports.getProdutosPorCategoria = async (req, res) => {
    try {
        const categoria = req.params.categoria;
        console.log('Categoria recebida:', categoria); // Log para depuração
        const produtos = await Produto.findAll({ where: { categoria: categoria } });
        console.log('Produtos encontrados:', produtos); // Log para depuração
        if (!produtos || produtos.length === 0) {
            return res.status(404).send('Produtos não encontrados para a categoria selecionada');
        }
        res.render(`produtos/categoria/${categoria}`, { produtos }); // Certifique-se de que o arquivo correspondente existe
    } catch (error) {
        console.error('Erro ao buscar produtos por categoria:', error);
        res.status(500).send('Erro ao buscar produtos por categoria');
    }
};

// Função para obter todos os produtos
exports.getAllProdutos = async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        res.render('produtos/listagem', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro ao buscar produtos');
    }
};

// Função para exibir o formulário de adição de produto
exports.getAddProdutoForm = (req, res) => {
    res.render('produtos/adicionar-produto'); // Certifique-se de que o arquivo 'adicionar-produto.ejs' existe
};

// Função para adicionar um novo produto
exports.addProduto = async (req, res) => {
    try {
        const { nome_produto, categoria, descricao, preco, imagem } = req.body;
        await Produto.create({ nome_produto, categoria, descricao, preco, imagem });
        res.redirect('/produtos/listagem'); // Atualize o redirecionamento conforme necessário
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).send('Erro ao adicionar produto');
    }
};

// Função para exibir o formulário de edição de produto
exports.getEditProdutoForm = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        res.render('produtos/editar-produto', { produto }); // Certifique-se de que o arquivo 'editar-produto.ejs' existe
    } catch (error) {
        console.error('Erro ao buscar produto para edição:', error);
        res.status(500).send('Erro ao buscar produto para edição');
    }
};

// Função para editar um produto
exports.editProduto = async (req, res) => {
    try {
        const { nome_produto, categoria, descricao, preco, imagem } = req.body;
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        await produto.update({ nome_produto, categoria, descricao, preco, imagem });
        res.redirect('/produtos/listagem'); // Atualize o redirecionamento conforme necessário
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).send('Erro ao editar produto');
    }
};

// Função para excluir um produto
exports.deleteProduto = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        await produto.destroy();
        res.redirect('/produtos/listagem'); // Atualize o redirecionamento conforme necessário
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).send('Erro ao excluir produto');
    }
};
