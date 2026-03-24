const express = require('express');
const router = express.Router();
const Blog = require('../models/BlogModel');
const { authenticate, adminOnly } = require('../middleware/authMiddleware'); 

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ data: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë marrjes së blogjeve" });
  }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { titulli, imazhi, tag, shkurtesa, permbajtja, autori } = req.body;
    
    const newBlog = new Blog({
      titulli,
      imazhi,
      tag,
      shkurtesa,
      permbajtja,
      autori
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: "Gabim në ruajtjen e blogut" });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Postimi u fshi me sukses" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë fshirjes" });
  }
});

module.exports = router;