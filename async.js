var Async = function () {
  var self = this;
  this.map = function (array, func, callback) {
    let count = array.length;
    let errors = [];
    let results = [];
    if (count !== 3) callback(new Error("Array length must be 3"));
    else {
      for (let index = 0; index < array.length; index++) {
        func(array[index], function (err, result) {
          count--;
          if (err) errors.push(result);
          else results.push(result);

          if (count < 1)
            return callback(errors.length > 0 ? errors : null, results);
        });
      }
    }
  };
  this.waterfall = function (jobs, callback) {
    // precedente fonction sans resultat :
    // [0] => jobs
    // [1] => callback

    // precedente fonction avec resultat :
    // [0] => jobs
    // [1] => result  at  // de la precedente fonction
    // [2] => callback

    var jobs = arguments[0];
    var callback = arguments.length > 2 ? arguments[2] : arguments[1];

    var job = jobs.shift();

    var after = function (err, result) {
      if (err) return callback(err);
      if (jobs.length < 1) return callback(null, result);

      let args = [];
      args.push(jobs);
      if (result != undefined) args.push(result);
      args.push(function (error, result) {
        if (error) return callback(error);
        return callback(null, result);
      });
      self.waterfall.apply(this, args);
    };

    //   arguments de la callback
    // sans resultat :
    // [0] => callback

    // avec resultat :
    // [0] => result
    // [1] => callback

    var args = [];
    if (arguments.length > 2) args.push(arguments[1]);
    args.push(after);

    job.apply(this, args);
  };
};

module.exports = new Async();
