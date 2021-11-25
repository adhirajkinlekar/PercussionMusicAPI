const ListClass = require('../utils/Listclass');
const ListModel = require('../model/listModel');
const ItemModel = require('../model/itemModel');
const CommentModel = require('../model/commentModel');
const VoteModel = require('../model/voteModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.mostFamous = ((req, res, next) => {
  req.params.query = {
    sort: likes, limit: 10
  }
  next()
})

exports.getLists = catchAsync(async (req, res, next) => {

  const list = new ListClass(ListModel.find(), req.query).filter().sort().select().paginate();
  const lists = await list.query;

  res.status(200).send({
    status: 'success',
    data: lists
  })
})

exports.getList = catchAsync(async (req, res, next) => {
  const list = await ListModel.findOne({ "_id": req.params.id }).populate({
    path: 'items',
    // options: { sort: { 'likes': -1 } },
    select: "-__v",
    limit: 100,
    populate: {
      path: 'comments',
      options: { sort: { 'createdDate': -1 } },
      select: "-__v",
      populate: {
        path: 'createdBy',
        select: "-__v"
      }
    }
  }).populate({
    path: 'createdBy',
    select: 'name'
  }).select("-__v");

  if (!list) {
    return next(new AppError('no tours found with that id', 404)) //emphasis on return
  }
  res.status(200).send({
    status: 'success',
    data: list
  })
})

exports.getListsInfo = catchAsync(async (req, res, next) => {
  const artistsInfo = await ListModel.find({}, {
    'name': 1,
    'artistId': 1
  })

  if (!artistsInfo) {
    return next(new AppError('no artists found', 404)) //emphasis on return
  }
  res.status(200).send({
    status: 'success',
    data: artistsInfo
  })
})

exports.getDiscogsId = catchAsync(async (req, res, next) => {
  const artistId = await ListModel.findOne({ "_id": req.params.id }).select("artistId");

  if (!artistId) {
    return next(new AppError('no artistId found with that id', 404)) //emphasis on return
  }
  res.status(200).send({
    status: 'success',
    data: artistId
  })
})


exports.updateList = catchAsync(async (req, res, next) => {
  //this only updates fields that are different in the body
  const list = await ListModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  //{ new:true} will return the new document
  if (!list) {
    return next(new AppError('no tours found with that id', 404)) //emphasis on return
  }
  res.status(200).send({
    status: 'success',
    data: list
  })
})

exports.deleteList = catchAsync(async (req, res) => {
  //this only updates fields that are different in the body
  const list = await ListModel.findByIdAndDelete(req.params.id)
  //in rest it is standard practive not to send any data to the client in delete operation
  if (!list) {
    return next(new AppError('no tours found with that id', 404)) //emphasis on return
  }
  res.status(200).send({
    status: 'success',
    data: null
  })
})

exports.createList = catchAsync(async (req, res) => {
  req.body.listInfo.createdDate = req.currentDate;
  const newList = await ListModel.create(req.body.listInfo)
  if (newList) {
    const item = await ItemModel.insertMany(req.body.songs);
    const itemIds = item.map((item) => {
      return item._id;
    })
    await ListModel.findByIdAndUpdate({ "_id": newList._id }, {
      $push: {
        items: itemIds
      }
    })
  }


  res.status(200).json({
    status: 'success',
    data: 'newList'
  })
})


exports.addItem = catchAsync(async (req, res) => {

  req.body.createdDate = req.currentDate;
  const item = await ItemModel.insertMany(req.body);

  await ListModel.findByIdAndUpdate({ "_id": req.params.id }, {
    $push: {
      items: item._id
    }
  })

  res.status(200).json({
    status: 'success',
    data: item
  })
})

exports.updateItem = catchAsync(async (req, res) => {

  const item = await ItemModel.findByIdAndUpdate(req.params.itemId, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).send({
    status: 'success',
    data: item
  })
})

exports.deleteItem = catchAsync(async (req, res) => {

  await ItemModel.findByIdAndDelete(req.params.itemId);

  await ListModel.findByIdAndUpdate(req.params.id, {
    $pull: { items: req.params.itemId }
  })
  res.status(200).send({
    status: 'success',
    data: null
  })
})

exports.addComment = catchAsync(async (req, res) => {
  req.body.createdDate = req.currentDate;
  const comment = await CommentModel.create(req.body);

  await ItemModel.findByIdAndUpdate({ "_id": req.params.itemId }, {
    $push: {
      comments: comment._id
    }
  })

  res.status(200).json({
    status: 'success',
    data: comment
  })
})
exports.updateComment = catchAsync(async (req, res) => {
  req.body.modifiedDate = req.currentDate;
  const comment = await CommentModel.findByIdAndUpdate(req.params.commentId, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).send({
    status: 'success',
    data: comment
  })
})

exports.deleteComment = catchAsync(async (req, res) => {

  await CommentModel.findByIdAndDelete(req.params.commentId);

  await ItemModel.findByIdAndUpdate(req.params.itemId, {
    $pull: {
      comments: req.params.commentId
    }
  })
  res.status(200).send({
    status: 'success',
    data: null
  })
})

exports.addRemoveVotes = catchAsync(async (req, res) => {
  const vote = await VoteModel.findOne({ userId: req.body.userId, listId: req.body.listId, itemId: req.body.itemId }); //using just find() returns an array of object

  if (vote) {
    await ItemModel.findByIdAndUpdate(req.body.itemId, {
      $pull: {
        likes: vote._id
      }
    })
    await VoteModel.findByIdAndDelete(vote._id)
  }
  else {
    const addedVote = await VoteModel.create(req.body);
    await ItemModel.findByIdAndUpdate({ "_id": req.params.itemId }, {
      $push: {
        likes: addedVote._id
      }
    })
  }

  res.status(200).send({
    status: 'success',
    data: null
  })
})


exports.getVotes = catchAsync(async (req, res) => {
  
  const userVotes = await VoteModel.find({ userId: req.params.userId, listId: req.params.id })

  res.status(200).send({
    status: 'success',
    data: userVotes
  })
})
