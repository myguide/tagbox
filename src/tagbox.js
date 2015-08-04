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

var tagbox =
{
    /**
     * @var target null Target element for the tag dialog
     * @var tagIndex int The index count for each tag
     * @var inputName string the default set of input names for tags
     * @var preset array An optional list of tags to be pre-defined
     * @var strict bool An option to set the sole use of pre-defined tags
     */
    target    : null,
    tagIndex  : 0,
    tagCount  : 0,
    inputName : "tags",
    preset    : [],
    strict    : false,

    /**
     * - Theme related code
     *
     * A default theme is set for each of the three kinds of elements tagbox
     * creates. This is for the input div, the initial input seen on load of
     * tagbox which is editable.
     *
     * The second element is the output area. This is the div where the tags
     * are put. Initially this is hidden as there are no tags to show.
     * 
     * The last kind of element is the tag itself. Multiple tags are generated
     * via the input area and can then be seen in the output div.
     */
    inputDefaults :
    {
        id         : "tagbox-content-area",
        width      : "100%",
        height     : "24px",
        cssFloat   : "left",
        border     : "thin solid #c9c9c9",
        padding    : "4px",
        paddingTop : "10px",
        outline    : "0px solid transparent",
        color      : "#444444",
        fontFamily : "Helvetica"
    },

    outputDefaults :
    {
        id           : "tagbox-content-output",
        position     : "relative",
        width        : "100%",
        cssFloat     : "left",
        padding      : "4px",
        border       : "thin solid #c9c9c9",
        borderBottom : "none",
        display      : "none"
    },

    tagDefaults :
    {
        display      : "inline",
        height       : "18px",
        cssFloat     : "left",
        margin       : "3px",
        padding      : "4px",
        border       : "thin solid #CBD8F2",
        borderRadius : "5px",
        background   : "#DEE7F7",
        color        : "#444444",
        fontFamily   : "Helvetica",
        fontWeight   : "lighter"
    },


    /**
     * init starts off the process by creating the needed
     * elements which in turn have their needed event handlers
     * for the tags to start appearing etc...
     *
     * @param e string the id of the base target element (div)
     *
     * @return null
     */
    init : function(e)
    {
        this.target = document.getElementById(e);
        if (this.target !== null) {
            this.createOutputArea();
            this.createInputArea();
        }
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
    createOutputArea : function()
    {
        var output = document.createElement("div");

        output.id                 = this.outputDefaults.id;
        output.style.position     = this.outputDefaults.position;
        output.style.width        = this.outputDefaults.width;
        output.style.cssFloat     = this.outputDefaults.cssFloat;
        output.style.padding      = this.outputDefaults.padding;
        output.style.border       = this.outputDefaults.border;
        output.style.borderBottom = this.outputDefaults.borderBottom;
        output.style.display      = this.outputDefaults.display;

        this.target.appendChild(output);
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
    createInputArea : function()
    {
        var input = document.createElement("div");

        input.contentEditable = true;

        input.id               = this.inputDefaults.id;
        input.style.width      = this.inputDefaults.width;
        input.style.height     = this.inputDefaults.height;
        input.style.cssFloat   = this.inputDefaults.cssFloat;
        input.style.border     = this.inputDefaults.border;
        input.style.padding    = this.inputDefaults.padding;
        input.style.paddingTop = this.inputDefaults.paddingTop;
        input.style.outline    = this.inputDefaults.outline;
        input.style.color      = this.inputDefaults.color;
        input.style.fontFamily = this.inputDefaults.fontFamily;  

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
    detectKeyPress : function(e)
    {
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
    appendTag : function()
    {
        var contentArea = document.getElementById("tagbox-content-area");
        var content        = contentArea.textContent;

        if (this.validateTagContent(content) === true) {
            contentArea.textContent = "";

            var output = document.getElementById("tagbox-content-output");

            if (output.style.display == "none") {
                output.style.display = "block";
            }

            var tag = document.createElement("div");
                tag.id                 = "tagbox-tag-" + this.tagIndex;
                tag.style.display      = this.tagDefaults.display;
                tag.style.height       = this.tagDefaults.height;
                tag.style.cssFloat     = this.tagDefaults.cssFloat;
                tag.style.margin       = this.tagDefaults.margin;
                tag.style.padding      = this.tagDefaults.padding;
                tag.style.border       = this.tagDefaults.border;
                tag.style.borderRadius = this.tagDefaults.borderRadius;
                tag.style.background   = this.tagDefaults.background;
                tag.style.color        = this.tagDefaults.color;
                tag.style.fontFamily   = this.tagDefaults.fontFamily;
                tag.style.fontWeight   = this.tagDefaults.fontWeight;
                tag.style.cursor       = "pointer";

                tag.innerHTML = content.trim();

                tag.addEventListener("click", function(e) {
                    tagbox.removeTag(e);
                });

            output.appendChild(tag);
            this.createHiddenInput(content);
        }
    },

    /**
     * validateTagContent makes sure that empty spaces and
     * otherwise blank tags are not added.
     *
     * @param content string The tag content
     *
     * @return bool
     */
    validateTagContent : function(content)
    {
        var noSpace = content.trim();
        if (noSpace !== "") {
            return true;
        }
        return false;
    },

    /**
     * removeTag removes both the hidden input attached to
     * the tag that has been created, and the tag div element
     * also.
     *
     * @param e onclick Event for clocking on a tag
     *
     * @return null
     */
    removeTag : function(e)
    {
        if (e.target.parentNode) {
            e.target.parentNode.removeChild(e.target);
        }

        var tagId = e.target.id.replace("tagbox-tag-", "");
        var tagInput = document.getElementById("tagbox-input-" + tagId);
        if (tagInput.parentNode) {
          tagInput.parentNode.removeChild(tagInput);
        }

        this.tagCount--;

        // TODO: This shoud be seperated from this method
        if (this.tagCount === 0) {
            // TODO: Stop getting this from getByElementId
            var output = document.getElementById("tagbox-content-output");
            output.style.display = "none";
        }
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
    createHiddenInput : function(tag)
    {
        var inputValue = document.createElement("input");
            inputValue.type  = "hidden";
            inputValue.name  = this.inputName + "[" + this.tagIndex + "]";
            inputValue.id    = "tagbox-input-" + this.tagIndex;
            inputValue.value = tag;

        this.target.appendChild(inputValue);
        this.tagIndex++;
        this.tagCount++;
    }
};