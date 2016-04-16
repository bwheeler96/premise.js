premise = function(property) {
  function noop(obj) {
    return obj;
  }

  function exist(obj) {
    return !!obj;
  }

  var matchChain = [property, noop];
  var GATES = {
    and: 0,
    or:  1
  };

  var matcher = function(obj) {
    var outcome;
    for(var i = 0; i < matchChain.length; i += 3) {
      var property  = matchChain[i];
      if (property == undefined) {
        property = obj;
      } else {
        property = obj[property];
      }
      var predicate = matchChain[i + 1];
      var nextOp    = matchChain[i + 2];
      outcome   = predicate(property);
      var truthy    = !!outcome;
      while (nextOp == GATES.and) {
        property  = obj[matchChain[i]];
        predicate = matchChain[i + 1];
        nextOp    = matchChain[i + 2];
        i += 3;
        if (!truthy) continue;
        outcome = !!predicate(property);
        if (!outcome) truthy = false;
        if (truthy && (nextOp == GATES.or || !nextOp)) return outcome;
      }
      if (truthy) return outcome;
    }
    return outcome;
  };

  var premiseChainFunctions = {
    lt: function(val) {
      return function(obj) {
        return obj < val;
      }
    },
    gt: function(val) {
      return function(obj) {
        return obj > val;
      }
    },
    gte: function(val) {
      return function(obj) {
        return obj >= val;
      }
    }
  }

  matcher.eq = function(val) {
    matchChain[matchChain.length - 1] = function equals(obj) {
      return obj == val;
    };
    return matcher;
  };

  matcher.ne = function(val) {
    return addPremiseChecker(function notEquals(obj) {
      return obj != val;
    });
  };

  matcher.gt = function(val) {
    return addPremiseChecker(function greaterThan(obj) {
      return obj > val;
    });
  };

  for (var functionName in premiseChainFunctions) {
    premiseChainFunction(functionName, premiseChainFunctions[functionName]);
  }

  function premiseChainFunction(name, callback) {
    matcher[name] = function(val) {
      return addPremiseChecker(callback(val));
    }
  }

  function addPremiseChecker(callback) {
    matchChain[matchChain.length - 1] = callback;
    return matcher;
  }

  matcher.or = function(property) {
    matchChain.push(GATES.or);
    matchChain.push(property);
    matchChain.push(exist);
    return matcher;
  };

  matcher.and = function(property) {
    matchChain.push(GATES.and);
    matchChain.push(property);
    matchChain.push(exist);
    return matcher;
  };

  return matcher;
};
