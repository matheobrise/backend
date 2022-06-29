import express from 'express';
import controller from '../controllers/article';

const router = express.Router();

router.post('/create', controller.createArticle);
router.get('/', controller.getAllArticles);
router.get('/:id', controller.getOneArticle);
router.put('/:id', controller.updateArticle);
router.delete('/:id', controller.deleteArticle);

export = router;
