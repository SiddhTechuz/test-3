const Product = require('../models/productModel')
const Color = require('../models/colorModel')
const ProductColor = require('../models/productColorModel')
exports.createProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let color = await Color.findOne({ name: req.body.color })
        if (!color) {
            color = await Color.create({
                name: req.body.color
            })
        }
        const product = await Product.create({
            name: req.body.name,
            image: req.body.image,
            quantity: req.body.quantity,
            price: req.body.price,
            user: userId
        })
        const productcolor = await ProductColor.create({
            productId: product.id,
            colorId: color.id
        })

        res.status(200).json({
            status: ' Product Added Successfully',
            product,
            color: color.name,
            // productcolor
        })

    }
    catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }
}
exports.getProducts = async (req, res) => {
    try {
        const productsWithColor = await Product.aggregate([
            {
                $lookup: {
                    from: 'productcolors',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'color'
                }
            },
            {
                $unwind: '$color'
            },
            {
                $lookup: {
                    from: 'colors',
                    localField: 'color.colorId',
                    foreignField: '_id',
                    as: 'colorDetails'
                }
            },
            {
                $unwind: '$colorDetails'
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    quantity: 1,
                    slug: 1,
                    price: 1,
                    color: '$colorDetails.name'
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: productsWithColor
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
exports.searchProduct = async (req, res, next) => {
    try {
        const searchedName = req.body.name
        const products = await Product.find({ name: { $regex: searchedName, $options: 'i' } })
        if (!products) {
            res.status(202).json({
                status: 'Not found',
                message: "No Product found"
            })
        }
        res.status(200).json({
            status: 'success',
            products
        })
    } catch (err) {
        res.status(404).json({
            status: 'success',
            message: err.message
        })
    }
}
exports.searchBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug
        const product = await Product.findOne({ slug })
        res.status(200).json({
            status: 'success',
            product
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'success',
            message: err.message
        })
    }
}