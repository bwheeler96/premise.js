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

