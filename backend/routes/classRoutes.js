const express = require('express');
const{
    createClass,
    joinClass,
    changeAcces,
    leaveClass,
    kickMember,
    deleteClass,
    transferOwnership,
    createTest,
    getTestData,
    submitTest,
    viewClass,
    getUserClasses,
    getPublicClasses
} = require('../controllers/classController');



const router = express.Router();

router.get('/viewClass/:classId', viewClass);
router.get('/getUserClasses', getUserClasses);
router.post('/createClass', createClass);
router.post('/joinClass', joinClass);
router.patch('/changeAcces', changeAcces);
router.delete('/leaveClass', leaveClass);
router.delete('/kickMember', kickMember);
router.delete('/deleteClass', deleteClass);
router.patch('/transferOwnership', transferOwnership);
router.post('/createTest', createTest);
router.get('/getTestData', getTestData);
router.post('/submitTest', submitTest);
router.get('/getPublicClasses', getPublicClasses)

module.exports = router;