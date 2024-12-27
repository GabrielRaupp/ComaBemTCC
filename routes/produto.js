const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');
const multer = require('multer');
const { Op } = require('sequelize');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Rota para exibir os produtos da categoria
router.get('/categoria', async (req, res) => {
    try {
        const { search, categoria } = req.query;

        let whereClause = {};
        if (search) {
            whereClause.nome_produto = { [Op.like]: `%${search}%` };
        }
        if (categoria) {
            whereClause.categoria = categoria;
        }

        const produtos = await Produto.findAll({ where: whereClause });
        res.render('categoria', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro ao carregar a página de categorias');
    }
});

// Rota para adicionar um novo produto
router.post('/adicionar', upload.single('imagem'), async (req, res) => {
    try {
        const { nome_produto, marca, origem, descricao, preco, categoria, promocao, destaque } = req.body;
        await Produto.create({
            nome_produto,
            marca,
            origem,
            descricao,
            preco,
            categoria,
            imagem: req.file ? req.file.filename : null,
            promocao: promocao || 0,
            destaque: destaque === 'on'
        });
        res.redirect('/categoria');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).send('Erro ao adicionar produto.');
    }
});

// Rota para editar produto
router.post('/editar', upload.single('imagem'), async (req, res) => {
    try {
        const { id, nome_produto, marca, origem, descricao, preco, categoria, promocao, destaque } = req.body;
        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        await produto.update({
            nome_produto,
            marca,
            origem,
            descricao,
            preco,
            categoria,
            imagem: req.file ? req.file.filename : produto.imagem,
            promocao: promocao || 0,
            destaque: destaque === 'on'
        });

        res.redirect('/categoria');
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).send('Erro ao editar produto.');
    }
});

// Rota para excluir produto
router.post('/excluir', async (req, res) => {
    try {
        const { id } = req.body;
        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        await produto.destroy();
        res.redirect('/categoria');
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).send('Erro ao excluir produto.');
    }
});

// Rota para visualizar o produto detalhado
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        const produtosPromocao = await Produto.findAll({ where: { promocao: true } });

        if (produto) {
            res.render('produto-detalhes', { produto, produtosPromocao });
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).send('Erro ao exibir detalhes do produto');
    }
});

module.exports = router;