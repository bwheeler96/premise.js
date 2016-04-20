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
    this.property  = property;
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
  matcher.and = function(property) {
    this.andChain.push(property);
    return matcher;
  };

  // I tried creating these shorthands in iteration but got weird errors
  // TODO clean this up
  matcher.or.eq        = function(val) { return matcher.or().eq(val)        };
  matcher.or.ne        = function(val) { return matcher.or().ne(val)        };
  matcher.or.strictEq  = function(val) { return matcher.or().strictEq(val); };
  matcher.or.strictNe  = function(val) { return matcher.or().strictNe(val); };
  matcher.or.gt        = function(val) { return matcher.or().gt(val);       };
  matcher.or.gte       = function(val) { return matcher.or().gte(val);      };
  matcher.or.lt        = function(val) { return matcher.or().lt(val);       };
  matcher.or.lte       = function(val) { return matcher.or().lte(val);      };
  matcher.or.add       = function(val) { return matcher.or().add(val);      };
  matcher.or.sub       = function(val) { return matcher.or().sub(val);      };
  matcher.or.mul       = function(val) { return matcher.or().mul(val);      };
  matcher.or.div       = function(val) { return matcher.or().div(val);      };
  matcher.or.mod       = function(val) { return matcher.or().mod(val);      };
  matcher.and.eq       = function(val) { return matcher.and().eq(val)        };
  matcher.and.ne       = function(val) { return matcher.and().ne(val)        };
  matcher.and.strictEq = function(val) { return matcher.and().strictEq(val); };
  matcher.and.strictNe = function(val) { return matcher.and().strictNe(val); };
  matcher.and.gt       = function(val) { return matcher.and().gt(val);       };
  matcher.and.gte      = function(val) { return matcher.and().gte(val);      };
  matcher.and.lt       = function(val) { return matcher.and().lt(val);       };
  matcher.and.lte      = function(val) { return matcher.and().lte(val);      };
  matcher.and.add      = function(val) { return matcher.and().add(val);      };
  matcher.and.sub      = function(val) { return matcher.and().sub(val);      };
  matcher.and.mul      = function(val) { return matcher.and().mul(val);      };
  matcher.and.div      = function(val) { return matcher.and().div(val);      };
  matcher.and.mod      = function(val) { return matcher.and().mod(val);      };
  return matcher;
};

premise = Premise;

premise.chainOperands = {
  ne:       function(val) {
              return function(obj) {
                return obj != val;
              };
            },
  eq:       function(val) {
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

for (var name in premise.chainOperands) {
  premise[name] = premise()[name];
}

