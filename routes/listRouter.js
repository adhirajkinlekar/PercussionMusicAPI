const express = require('express')
const listController = require('../controller/ListController')
const router = express.Router();
const authController = require('../controller/authController')

router.param('id', (req, res, next, val) => {
  //   if(isNaN(val)){
  //     return  res.status(400).json({
  //     status: 'error',
  //     message: 'Not a valid Id'
  //   });
  // };
  next();
})

router.route('/')
  .get(listController.getLists);

router.route('/listsInfo')
  .get(listController.getListsInfo);

router.route('/:id')
  .get(listController.getList);

router.route('/:id/discogsId')
  .get(listController.getDiscogsId);

router.use(authController.protect,
  authController.restrictTo('admin', 'user'));

//------------------protected--------------------//


router.route('/:id/:userId/votes')
  .get(listController.getVotes
  )

router.route('/items/:itemId/vote')
  .post(listController.addRemoveVotes
  )

router.route('/items/:itemId/comments')
  .post(listController.addComment
  )

router.route('/items/:itemId/comments/:commentId')
  .patch(listController.updateComment)
  .delete(listController.deleteComment)


router.use(authController.protect,
  authController.restrictTo('admin'));

//------------------protected--------------------//

router.route('/')
  .post(listController.createList
  );

router.route('/:id')
  .patch(listController.updateList)
  .delete(listController.deleteList
  );

router.route('/:id/items')
  .post(listController.addItem
  )

router.route('/:id/items/:itemId')
  .patch(listController.updateItem)
  .delete(listController.deleteItem)




module.exports = router;