const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const dashboards = require('../controllers/dashboardController');

// Welcome Page
router.get('/', (req, res) => res.render('welcome', { page_name: 'welcome'}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, dashboards.dashboard);

// Dashboard/Upload
router.get('/dashboard/upload', ensureAuthenticated, dashboards.upload);

// Dashboard/Account
router.get('/dashboard/account', ensureAuthenticated, dashboards.account);

// Dashboard/upload/Document
router.get('/dashboard/upload/document', ensureAuthenticated, dashboards.document);

// Dashboard/upload/Document/photo  GET
router.get('/dashboard/upload/document/photo', ensureAuthenticated, dashboards.document_photo_get);

// Dashboard/upload/Document/photo  POST
router.post('/dashboard/upload/document/photo', ensureAuthenticated, dashboards.document_photo_post);

// Dashboard/upload/Document/pdf
router.get('/dashboard/upload/document/pdf', ensureAuthenticated, dashboards.document_pdf_get);

// Dashboard/upload/Document/pdf
router.post('/dashboard/upload/document/pdf', ensureAuthenticated, dashboards.document_pdf_post);

// Dashboard/upload/Document/post
router.get('/dashboard/upload/document/post', ensureAuthenticated, dashboards.document_post);

// Dashboard/upload/Notice
router.get('/dashboard/upload/notice', ensureAuthenticated, dashboards.notice);

// Dashboard/upload/Notice/photo
router.get('/dashboard/upload/notice/photo', ensureAuthenticated, dashboards.notice_photo);

// Dashboard/upload/Notice/pdf
router.get('/dashboard/upload/notice/pdf', ensureAuthenticated, dashboards.notice_pdf);

// Dashboard/upload/Notice/post
router.get('/dashboard/upload/notice/post', ensureAuthenticated, dashboards.notice_post);

module.exports = router;
