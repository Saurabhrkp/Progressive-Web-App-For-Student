const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const dashboards = require('../controllers/dashboardController');
const details = require('../controllers/detailController');

// Welcome Page
router.get('/', (req, res) => res.render('welcome', { current: 'welcome'}));

// Dashboard Control
router.get('/dashboard', ensureAuthenticated,dashboards.dashboard);

// Dashboard/Upload
router.get('/dashboard/upload', dashboards.upload);

// Dashboard/Account
router.get('/dashboard/account', ensureAuthenticated, dashboards.account);

// Dashboard/upload/Document
router.get('/dashboard/upload/document', ensureAuthenticated, dashboards.document);

// Dashboard/upload/Document/photo
router.get('/dashboard/upload/document/photo', ensureAuthenticated, dashboards.document_photo_get);

router.post('/dashboard/upload/document/photo', ensureAuthenticated, dashboards.document_photo_post);

// Dashboard/upload/Document/pdf
router.get('/dashboard/upload/document/pdf', ensureAuthenticated, dashboards.document_pdf_get);

router.post('/dashboard/upload/document/pdf', ensureAuthenticated, dashboards.document_pdf_post);

// Dashboard/upload/Document/post
router.get('/dashboard/upload/document/post', ensureAuthenticated, dashboards.document_post_get);

router.post('/dashboard/upload/document/post', ensureAuthenticated, dashboards.document_post_post);

// Dashboard/upload/Notice
router.get('/dashboard/upload/notice', ensureAuthenticated, dashboards.notice);

// Dashboard/upload/Notice/photo
router.get('/dashboard/upload/notice/photo', ensureAuthenticated, dashboards.notice_photo_get);

router.post('/dashboard/upload/notice/photo', ensureAuthenticated, dashboards.notice_photo_post);

// Dashboard/upload/Notice/pdf
router.get('/dashboard/upload/notice/pdf', ensureAuthenticated, dashboards.notice_pdf_get);

router.post('/dashboard/upload/notice/pdf', ensureAuthenticated, dashboards.notice_pdf_post);

// Dashboard/upload/Notice/post
router.get('/dashboard/upload/notice/post', ensureAuthenticated, dashboards.notice_post_get);

router.post('/dashboard/upload/notice/post', ensureAuthenticated, dashboards.notice_post_post);

//Detail Controls
router.get('/photo/:id', details.photo_detail);

router.get('/pdf/:id', details.pdf_detail);

router.get('/text/:id', details.post_detail);

//Download Photo Link
router.get('/download/:id', details.photo_download);

//Detail Controls
router.get('/document', details.document);

router.get('/notice', details.notice);

module.exports = router;
