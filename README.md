# Tagbox

Tag box is a small component (~2.3K minified) with zero dependencies
that allows you to create "tag like" inputs for your forms. This is
still in the very VERY early stages of development, so I would not
recommend using it just yet.

### Usage
This IS going to change! But for now it can be used like this:

```javascript
	tagbox.init("my-div");
```

`my-div` being the id of the div where you'd like the input
to be created.

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
  - Create new Github pull request
