module.exports = function(mongoose) {
    this.db={};

    //user model create
    var user = new mongoose.Schema({
        name: {type:String, unique:true}
    });
    this.db.user=mongoose.model('user', user);

};