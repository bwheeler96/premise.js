require('../premise.js');
var _ = require('underscore');
describe('Premise.js', function() {
  var integers = [1, 2, 3, 4, 5, 6, 7];
  var strings  = ['apple', 'pear', 'banana', 'orange'];
  var posts  = [
    {
      post:   'Premise.js is really cool!',
      sticky: true,
      date:   new Date('1999-12-31')
    },
    {
      post:   'How to use Premise.js with underscore or lodash',
      sticky: false,
      date:   new Date('1999-12-31')
    },
    {
      post:   'New uses for premise.js',
      sticky: false,
      date:   new Date()
    }
  ];

  it('uses defaults to a noop function', function() {
    var withPremise = _.map(integers, premise());
    expect(integers).toEqual(withPremise);
  });

  it('accepts chained premises on default', function() {
    var withPremise = _.map(strings, premise().eq('banana'));
    expect(withPremise).toEqual([false, false, true, false]);
  });

  it('accepts an attributes with noop', function() {
    var stringLengths = _.map(strings, premise('length'));
    expect(stringLengths).toEqual([5, 4, 6, 6]);
    
    var stickyPosts = _.select(posts, premise('sticky'));
    expect(stickyPosts).toEqual([ posts[0] ]);
  });

  it('selects numbers greater than', function() {
    var gt5 = _.select(integers, premise().gt(5));
    expect(gt5).toEqual([6, 7]);
  });

  it('maps numbers with less than', function() {
    var lt4 = _.map(integers, premise().lt(4));
    expect(lt4).toEqual([true, true, true, false, false, false, false]);
  });

  it('accepts chained OR premises with a property', function() {
    var stickyOrRecent = _.select(posts, premise('sticky').eq(true).or('date').gt(new Date('2009-12-31')));
    expect(stickyOrRecent).toEqual([ posts[0], posts[2] ]);
  });
});
