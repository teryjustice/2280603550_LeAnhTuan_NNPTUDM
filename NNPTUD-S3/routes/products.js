const express = require('express')
let router = express.Router()
let slugify = require('slugify')
let productSchema = require('../schemas/products'); // DBset/DBContext

// GET all products (not deleted)
router.get('/', async (req, res) => {
    try {
        let dataProducts = await productSchema.find({ isDeleted: false }).populate('category');
        res.send(dataProducts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// GET one product by ID
router.get('/:id', async (req, res) => {
    try {
        let dataProduct = await productSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        }).populate('category');
        if (!dataProduct) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(dataProduct);
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" });
    }
})

// POST create new product
router.post('/', async (req, res) => {
    try {
        let newProduct = new productSchema({
            title: req.body.title,
            slug: slugify(req.body.title, {
                replacement: '-',
                lower: false,
                remove: undefined,
            }),
            price: req.body.price,
            description: req.body.description,
            images: req.body.images,
            category: req.body.category
        });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

// PUT update product by ID
router.put('/:id', async (req, res) => {
    try {
        // Auto-update slug if title is being changed
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, {
                replacement: '-',
                lower: false,
                remove: undefined,
            });
        }
        let getItem = await productSchema.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (getItem) {
            res.send(getItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

// DELETE soft-delete product by ID
router.delete('/:id', async (req, res) => {
    try {
        let getItem = await productSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!getItem) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            getItem.isDeleted = true;
            await getItem.save();
            res.send(getItem);
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

module.exports = router;