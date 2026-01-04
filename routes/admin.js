var express = require('express');
var router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/', adminController.renderAdminPage);
router.get('/users', adminController.renderAllUsersPage);
router.get('/catalog', adminController.renderAdminCatalogPage);
router.get('/stats', adminController.renderAdminStatsPage);
router.get('/communication', adminController.renderAdminCommunicationPage);


router.post('/catalog/genre', adminController.handleAddGenre);
router.post('/catalog/language', adminController.handleAddLanguage);
router.post('/catalog/location', adminController.handleAddLocation);
router.post('/catalog/condition', adminController.handleAddCondition);
router.post('/broadcast', adminController.sendBroadcast);
router.post('/reports/:id/:action', adminController.handleReportAction);
router.post('/reports/user', adminController.handleReportUser);

router.put('/user/archive/:id', adminController.archiveUser);
router.put('/catalog/:type/:id', adminController.handleUpdateCatalog);

router.delete('/catalog/:type/:id', adminController.handleDeleteCatalog);

module.exports = router;