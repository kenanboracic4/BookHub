var express = require('express');
var router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/', adminController.renderAdminPage);
router.get('/users', adminController.renderAllUsersPage);
router.get('/catalog', adminController.renderAdminCatalogPage);
router.get('/stats', adminController.renderAdminStatsPage);

router.post('/catalog/genre', adminController.handleAddGenre);
router.post('/catalog/language', adminController.handleAddLanguage);
router.post('/catalog/location', adminController.handleAddLocation);
router.post('/catalog/condition', adminController.handleAddCondition);

router.put('/user/archive/:id', adminController.archiveUser);
router.put('/catalog/:type/:id', adminController.handleUpdateCatalog);

router.delete('/catalog/:type/:id', adminController.handleDeleteCatalog);

module.exports = router;