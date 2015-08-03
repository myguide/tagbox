// tagbox v0.0.1-dev
//
// (c) myguide.io 2015
//
// @package tagbox
// @version 0.0.1-dev
//
// @author Harry Lawrence <http://github.com/hazbo>
//
// License: MIT
//
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

var tagbox = {
    /**
     * @var target null Target element for the tag dialog
     * @var width string The initial width of the text box
     * @var height string The initial height of the text box
     * @var tagIndex int The index count for each tag
     * @var preset array An optional list of tags to be pre-defined
     * @var strict bool An option to set the sole use of pre-defined tags
     */
    target    : null,
    width     : "100%",
    height    : "37px",
    tagIndex  : 0,
    inputName : "tags",
    preset    : [],
    strict    : false,

    /**
     * init starts off the process by creating the needed
     * elements which in turn have their needed event handlers
     * for the tags to start appearing etc...
     *
     * @param e string the id of the base target element (div)
     *
     * @return null
     */
    init : function(e) {
        this.target = document.getElementById(e);
        this.createOutputArea();
        this.createInputArea();
    },

    /**
     * createOutputArea creates a new div element with some
     * default options and appends this to the initial
     * target element.
     *
     * This is where the tags will start to appear once the
     * user hits one of the keys that triggers the word(s)
     * to be appended to the output element.
     *
     * @return null
     */
    createOutputArea : function() {
        var output = document.createElement("div");
        if (output != null) {
            output.id             = "tagbox-content-output";
            output.style.cssFloat = "left";
            output.style.width    = "100%";
            output.style.position = "relative";

            this.target.appendChild(output);
        }
    },

    /**
     * createInputArea creates the editable (div) area
     * where new tags can be added.
     *
     * Some default styles are added here which can be
     * easily written over with CSS
     *
     * @return null
     */
    createInputArea : function() {
        var input = document.createElement("div");

        input.contentEditable = true;
        input.style.outline   = "0px solid transparent";
        input.style.width     = this.width;
        input.id              = "tagbox-content-area";
        input.style.cssFloat  = "left";
        input.style.border    = "thin solid #c9c9c9";
        input.style.height    = this.height;
        input.style.padding        = "4px";

        input.addEventListener('keydown', function (e) {
            tagbox.detectKeyPress(e);
        });

        this.target.appendChild(input);
    },

    /**
     * detectKeyPress checks to see if the key that has been
     * pressed is the tab, the enter or the comma key.
     *
     * Once pressed, if it one of the three, it will make a
     * call to appendTag.
     *
     * @param e keydown event
     *
     * @return null
     */
    detectKeyPress : function(e) {
        if (e.which == 9 || e.which == 13 || e.which == 188) {
            e.preventDefault();
            this.appendTag();
        }
    },

    /**
     * appendTag creates the new (div) element for the new tag
     * and populates it with the text entered into the input into
     * this newly created element.
     *
     * @return null
     */
    appendTag : function() {
        var contentArea = document.getElementById("tagbox-content-area");
        var word        = contentArea.textContent;

        contentArea.textContent = "";

        var output = document.getElementById("tagbox-content-output");

        var tag = document.createElement("div");
            tag.style.background   = "#DEE7F7";
            tag.style.color        = "#666666";
            tag.style.border       = "thin solid #CBD8F2";
            tag.style.display      = "inline";
            tag.style.margin       = "3px";
            tag.style.padding      = "4px";
            tag.style.borderRadius = "5px";
            tag.style.height       = "30px;"
            tag.style.cssFloat     = "left";
            tag.id                 = "tagbox-tag-" + this.tagIndex;
            tag.innerHTML          = word;

        output.appendChild(tag);
        this.createHiddenInput(word);
    },

    /**
     * createHiddenInput creates the input(s) used to send the tag values
     * as form data to the server. This is done using the tagIndex along with
     * a given input name which can be set manually but defaults to 'tags'.
     *
     * @param tag string The name of the tag
     *
     * @return null
     */
    createHiddenInput : function(tag) {
        var inputValue = document.createElement("input");
            inputValue.type  = "hidden";
            inputValue.name  = this.inputName + "[" + this.tagIndex + "]";
            inputValue.value = tag;

        this.target.appendChild(inputValue);
        this.tagIndex++;
    }
}