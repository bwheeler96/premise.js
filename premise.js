function Premise(property) {
  function noop(obj) {
    return obj;
  }

  function exist(obj) {
    return !!obj;
  }

  var matcher = function(obj) {
    return matcher.orChain.value(obj); 
  };
  matcher.value = matcher;

  for (var name in premise.chainOperands)
    premiseChainFunction(name, premise.chainOperands[name]);

  function premiseChainFunction(name, callback) {
    matcher[name] = function(val) {
      return addPremiseChecker(callback(val));
    }
  }

  function addPremiseChecker(callback) {
    matcher.andChain.chain[matcher.andChain.chain.length - 1].predicate = callback;
    return matcher;
  }

  function Operator(property, predicate) {
    this.property = property;
    this.predicate = predicate;
    var self = this;
    this.value = function(obj) {
      if (!self.property) return self.predicate(obj);
      return self.predicate(obj[self.property]);
    };
    return this;
  }

  function AndChain() {
    this.chain = [];
    var self = this;
    this.push = function(property) {
      if (typeof property == 'function') 
        self.chain.push(property);
      else
        self.chain.push(new Operator(property, noop));
    };
    var result;
    this.value = function(obj) {
      for (var i = 0; i < self.chain.length; i++) {
        result = self.chain[i].value(obj);
        if (!result) return result;
      }
      return result;
    };
  }

  function OrChain() {
    this.chain = [];
    var self = this;
    this.push = function(andChain) {
      self.chain.push(andChain);
    };
    var result;
    this.value = function(obj) {
      for (var i = 0; i < self.chain.length; i++) {
        result = self.chain[i].value(obj);
        if (result)
          return result;
      }
      return result;
    };
  }

  matcher.andChain = new AndChain();
  matcher.andChain.push(property);
  matcher.orChain  = new OrChain();
  matcher.orChain.push(matcher.andChain);

  matcher.or  = function(property) {
    this.andChain = new AndChain();
    this.andChain.push(property);
    this.orChain.push(this.andChain);
    return matcher;
  };
  for (var name in premise.chainOperands) 
    matcher.or[name] = function(val) {
      return matcher.or()[name](val);
    };

  matcher.and = function(property) {
    this.andChain.push(property);
    return matcher;
  };
  return matcher;
};

premise = Premise;

premise.chainOperands = {
  ne: function(val) {
    return function(obj) {
      return obj != val;
    };
  },
  eq: function(val) {
    return function(obj) {
      return obj == val;
    };
  },
  strictEq: function(val) {
              return function(obj) {
                return obj === val;
              };
            },
  strictNe: function(val) {
              return function(obj) {
                return obj !== val;
              };
            },
  gt:       function(val) {
              return function(obj) {
                return obj > val;
              };
            },
  gte:      function(val) {
              return function(obj) {
                return obj >= val;
              };
            },
  lt:       function(val) {
              return function(obj) {
                return obj < val;
              };
            },
  lte:      function(val) {
              return function(obj) {
                return obj <= val;
              };
            },
  add:      function(val) {
              return function(obj) {
                return obj + val;
              };
            },
  sub:      function(val) {
              return function(obj) {
                return obj - val;
              };
            },
  mul:      function(val) {
              return function(obj) {
                return obj * val;
              };
            },
  div:      function(val) {
              return function(obj) {
                return obj / val;
              };
            },
  mod:      function(val) {
              return function(obj) {
                return obj % val;
              };
            }
};

// TODO make these shorthand matchers work
// Should be able to call premise.eq(true) to get => function(obj) { return obj == true } etc...
for (var name in premise.chainOperands) {
  premise[name] = function(val) {
    return premise()[name](val);
  };
}
