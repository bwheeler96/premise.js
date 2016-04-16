premise = function Premise(property) {
  function noop(obj) {
    return obj;
  }

  function exist(obj) {
    return !!obj;
  }

  var GATES = {
    and: 0,
    or:  1
  };

  var premiseOperands = ['lt', 'lte', 'gt', 'gte', 'strictEq', 'strictNe', 'eq', 'ne', 'add', 'sub', 'mult', 'div'];
  for (var idx in premiseOperands) {
    var name = premiseOperands[idx];
    premiseChainFunction(name, premise[name]);
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

  

  premise.Operand = function(property, predicate, gate) {
    this.gate == gate;
    

  return matcher;
};

premise.ne = function(val) {
  return function(obj) {
    return obj != val;
  };
};

premise.eq  = function(val) {
  return function(obj) {
    return obj == val;
  };
};

premise.strictEq = function(val) {
  return function(obj) {
    return obj === val;
  };
};

premise.strictNe = function(val) {
  return function(obj) {
    return obj !== val;
  };
};

premise.gt = function(val) {
  return function(obj) {
    return obj > val;
  };
};

premise.gte = function(val) {
  return function(obj) {
    return obj >= val;
  };
};

premise.lt = function(val) {
  return function(obj) {
    return obj < val;
  };
};

premise.lte = function(val) {
  return function(obj) {
    return obj <= val;
  };
};

premise.add = function(val) {
  return function(obj) {
    return obj + val;
  };
};

premise.sub = function(val) {
  return function(obj) {
    return obj - val;
  };
};

premise.mult = function(val) {
  return function(obj) {
    return obj * val;
  };
};

premise.div = function(val) {
  return function(obj) {
    return obj / val;
  };
};

premise.mod = function(val) {
  return function(obj) {
    return obj % val;
  };
};
