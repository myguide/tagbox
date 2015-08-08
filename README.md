# Tagbox

Tag box is a small component (~2.9K minified) with zero dependencies
that allows you to create "tag like" inputs for your forms. This is
still in the very VERY early stages of development, so I would not
recommend using it just yet.

You can check out [a demo here](https://jsfiddle.net/o4cc8cnd/4/).

![tagbox](https://raw.githubusercontent.com/myguide/tagbox/master/images/demo.png)

### Installing

```bash
$ bower install tagbox
```

Or add `"tagbox" : "~0.0.4"` to your bower.json file.

### Usage
This IS going to change! But for now it can be used like this:

```javascript
tagbox.init('my-div');
```
`my-div` being the id of the div where you'd like the input
to be created.

Tagbox comes with a default theme that doesn't require you to add / include
any CSS to your project. These can easily be overridden using either Javascript
or CSS. i.e.

```javascript
tagbox.init('my-div', {
	tag: {
		borderRadius: "10px",
		fontWeight: "normal"
	},
	input: {
		background: "#ff0000",
	},
	output: {
		// some more styles here etc...
	}
});
```

This will simply allow you to modify what is already there and you can use
anything that works inline with the `element.style.<somthing>` API in Javascript.

Alternatively, you can disable all of these and use your own CSS. The
[default.css](https://github.com/myguide/tagbox/blob/master/default.css) file can
be used as a template for this if needed:

```javascript
tagbox.init('my-div', {
	defaultTheme: false
});
```

Regular CSS will now work with Tagbox.

### Building

Requires [Gulp](https://github.com/gulpjs/gulp) to build.

```bash
$ git clone git@github.com:myguide/tagbox.git
$ cd tagbox
$ npm install
$ gulp build
```

### Contributing

Tagbox accepts Github pull requests. Be sure to write a
[good commit message](http://chris.beams.io/posts/git-commit/).

  - Fork Tagbox
  - Create a feature branch (`git checkout -b my-feature`)
  - Commit your changes (`git commit`)
  - Push to your feature branch (`git push origin my-feature`)
  - Create new pull request
