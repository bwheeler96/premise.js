# premise.js

IMO javascript's saving grace is its built in asynchronousity with the ability to pass around functions.

```
get('something', function doThisAfterGettingSomething(data) {
  // Do stuff with data
});
```

but this creates a stylistic problem:

```
get('something', function(data) {
  var values = map(data, function(item) {
    return map(item.posts, function(otherItem) {
      return // finally return the thing you wanted
    });
  });
  // do something with values
});
```

This is also commonly referred to as callback hell. http://callbackhell.com

*What if there was a way to simplify logical predicates?*

# Examples

```
get('posts', function(posts) {
  var stickyPosts = _.select(posts, predicate('sticky'));
});
```

But wait there's more!

You can do use any javascript operator or gate
`|| && + - / * < > <= >= == !=`

```
var recentPosts = _.select(posts, predicate('sticky').or('timestamp').gt(new Date('2016-1-1')))
```

# Usage
```
predicate(attribute)
```
predicate returns a matcher object, on which you can call any of the chain functions `and, or, gt, lt, gte, lte, eq, ne, add, sub, mult, div, strictEq, strictNeq`

More to come. Enjoy!
