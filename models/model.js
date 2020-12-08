const { MongoClient, ObjectID, ObjectId, connect } = require('mongodb');

const uri = "mongodb://localhost:27017/dbs";
const COLLECTION_NAME = 'comment';
const POSTS_PER_PAGE = 5;

class Post {
    constructor() {
        this._id = new ObjectId();
        this.author = "Anonymous";
        this.likes = 0;
        this.content = "";
        this.comment = [];
    }
    setAuthor(author) {
        this.author = author;
        return this;
    }
    setContent(content) {
        this.content = content;
        return this;
    }
}

MongoClient.connect(uri, async function(err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', uri);

        // await listDatabases(client);
        var collection = client.db().collection(COLLECTION_NAME);
        // post = new Post();
        // post.setAuthor("Luu Ha").setContent("Second post");
        // collection.insertOne(post, function(err, result) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(result.result);
        //     }
        // });

        // collection.find({ author: "Doan Sinh Man" }).toArray(function(err, result) {
        //     console.log(result)
        // });
        // dsm = {
        //     _id: 0x5fcd03a26537692a9827e98a,
        //     author: 'Doan Sinh Man',
        //     time: 1607271330488,
        //     likes: 0,
        //     content: 'First post',
        //     comment: []
        // }

        // collection.insertOne(dsm, function(err, result) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log(result.result);
        //         }
        //     })
        //     //Close connection
        // collection.find({ author: "Doan Sinh Man" }).toArray(function(err, result) {
        //     result.forEach(ele => { console.log(typeof(ele._id)); })
        // });

        // collection.deleteMany({
        //     $or: [
        //         { _id: 0x5fcd03a26537692a9827e98a },
        //         { _id: '5fcd03a26537692a9827e98a' }
        //     ]
        // })
        // await module.exports.insertComment("Cuong Mai", "First comment", "5fcd03a26537692a9827e98a");

        // collection.find({ _id: ObjectID("5fcd03a26537692a9827e98a") }).toArray(function(err, result) {
        //     console.log(result[0].comment[0])
        // });

        // collection.find({ $and: [{ "_id": ObjectID("5fcd03a26537692a9827e98a") }, { "comment._id": ObjectID("5fcdbf52a91e552c88b099c6") }] }).toArray(function(err, result) {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log(result)
        //     }
        // });
        // var cmt = new Post().setAuthor('Nguyen Quang Tung').setContent("New comment");
        // collection.updateOne({}, { $push: { "comment.$[].comment.$[cmt_field]": cmt } }, { arrayFilters: [{ "cmt_field._id": ObjectId("5fcdbf52a91e552c88b099c6") }] })
        // collection.updateOne({}, { $set: { "comment.$[].comment.$[cmtfield].author": "Mai Thi Kim Cuong" } }, { arrayFilters: [{ "cmtfield.author": "Cuong Mai" }] })
        // collection.updateOne({}, { $push: { "comment.$[lev1cmt].comment": cmt } }, { arrayFilters: [{ "lev1cmt._id": ObjectId("5fcdbf52a91e552c88b099c6") }] })
        // module.exports.insertComment("Nguyen Quang Tung", "New comment", "5fcd03a26537692a9827e98a");
        // module.exports.insertReply("Phan Vu Hoang Hieu", "Level 3 reply", "5fcdf06f9ebd1f1a903f7072", 3);
        // module.exports.editPost("5fcd03a26537692a9827e98a", "First post - changed again");
        // module.exports.editComment("5fcdbf52a91e552c88b099c6", "First comment - changed");
        // module.exports.deleteReply("5fcdf8a447aef8196021f9e5", 3)
        // console.log(await module.exports.getPost("5fcd03a26537692a9827e98a"));
        // console.log(await module.exports.getPostsOfPage(1));
        client.close();
    }
});

module.exports.insertPost = async(author, content) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            post = new Post().setAuthor(author).setContent(content);
            collection.insertOne(post, function(err, result) {
                console.log(err || result.result);
            });
            //Close connection
            client.close();
        }
    });
}

//Level 1
module.exports.insertComment = async(author, content, postId) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            var cmt = new Post().setAuthor(author).setContent(content);
            collection.updateOne({ _id: ObjectID(postId) }, { $push: { comment: cmt } }, function(err, result) {
                console.log(err || result.result);
            })
        }
    });
}

//Level greater than 1
module.exports.insertReply = async(author, content, superId, level) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            var cmt = new Post().setAuthor(author).setContent(content);
            // collection.updateOne({}, { $push: { "comment.$[lev1cmt].comment": cmt } }, { arrayFilters: [{ "lev1cmt._id": ObjectId("5fcdbf52a91e552c88b099c6") }] })
            let lhs = "comment.$[super].comment";
            for (let i = 0; i < level - 2; i++) {
                lhs = "comment.$[]." + lhs;
            }
            let pushSet = {};
            pushSet[lhs] = cmt;
            collection.updateOne({}, { $push: pushSet }, { arrayFilters: [{ "super._id": ObjectId(superId) }] }, function(err, result) {
                console.log(err || result.result);
            });
        }
    });
}

module.exports.editPost = async(postId, content) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            collection.updateOne({ _id: ObjectId(postId) }, { $set: { "content": content } }, function(err, result) {
                console.log(err || result.result);
            });
        }
    });
}

module.exports.editComment = async(commentId, content) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            collection.updateOne({}, { $set: { "comment.$[thiscmt].content": content } }, { arrayFilters: [{ "thiscmt._id": ObjectId(commentId) }] }, function(err, result) {
                console.log(err || result.result);
            })
        }
    });
}

module.exports.editReply = async(replyId, level, content) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            // collection.updateOne({}, { $push: { "comment.$[lev1cmt].comment": cmt } }, { arrayFilters: [{ "lev1cmt._id": ObjectId("5fcdbf52a91e552c88b099c6") }] })
            let lhs = "comment.$[thisreply].content";
            for (let i = 0; i < level - 1; i++) {
                lhs = "comment.$[]." + lhs;
            }
            let pushSet = {};
            pushSet[lhs] = content;
            collection.updateOne({}, { $set: pushSet }, { arrayFilters: [{ "thisreply._id": ObjectId(replyId) }] }, function(err, result) {
                console.log(err || result.result);
            });
        }
    });
}

module.exports.deletePost = async(postId) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            collection.deleteOne({ _id: ObjectId(postId) }, function(err, result) {
                console.log(err || result.result);
            })
        }
    });
}

module.exports.deleteComment = async(commentId) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            collection.updateOne({}, { $pull: { "comment": { "_id": ObjectId(commentId) } } }, function(err, result) {
                console.log(err || result.result);
            })
        }
    });
}

module.exports.deleteReply = async(replyId, level) => {
    MongoClient.connect(uri, async function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = client.db().collection(COLLECTION_NAME);
            let lhs = "comment";
            for (let i = 0; i < level - 1; i++) {
                lhs = "comment.$[]." + lhs;
            }
            let pullSet = {};
            pullSet[lhs] = { "_id": ObjectId(replyId) }

            collection.updateOne({}, { $pull: pullSet }, function(err, result) {
                console.log(err || result.result);
            })
        }
    });
}

module.exports.getPost = async(postId) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, async function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = client.db().collection(COLLECTION_NAME);
                collection.findOne({ _id: ObjectId(postId) }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        // console.log(result);
                        resolve(result);
                    }
                })
            }
        });
    }).catch((error) => { console.log(error) });
}

module.exports.getPostsOfPage = async(page) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, async function(err, client) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = client.db().collection(COLLECTION_NAME);
                collection.find({}).sort({ _id: -1 }).limit(page * POSTS_PER_PAGE).skip((page - 1) * POSTS_PER_PAGE).toArray(function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    }).catch((error) => { console.log(error) });
}

module.exports.getNumOfPage = async() => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, async function(err, client) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    var collection = client.db().collection(COLLECTION_NAME);
                    resolve(Math.ceil((await collection.countDocuments({})).toString() / POSTS_PER_PAGE));
                }
            });
        }).catch((error) => { console.log(error) });
    }
    // async function listDatabases(client) {
    //     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };