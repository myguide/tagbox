// tagbox v0.0.3
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
     * - Public properties
     *
     * @var inputName string the default set of input names for tags
     * @var preset array An optional list of tags to be pre-defined
     * @var strict bool An option to set the sole use of pre-defined tags
     */
    inputName    : "tags",
    preset       : [],
    strict       : false,
    defaultTheme : true,

    /**
     * @var target null Target element for the tag dialog
     * @var tagIndex int The index count for each tag
     */
    target       : null,
    tagIndex     : 0,
    tagCount     : 0,

    /**
     * @var inputElement null The element where tag name are put
     * @var outputElement null The element where tags appear
     */
    inputElement  : null,
    outputElement : null,

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
    inputStyle :
    {
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

    outputStyle :
    {
        width        : "100%",
        cssFloat     : "left",
        padding      : "4px",
        border       : "thin solid #c9c9c9",
        borderBottom : "none",
        display      : "none"
    },

    tagStyle :
    {
        height       : "18px",
        cssFloat     : "left",
        margin       : "3px",
        padding      : "4px",
        border       : "thin solid #cbd8f2",
        borderRadius : "5px",
        background   : "#DEE7F7",
        color        : "#444444",
        fontFamily   : "Helvetica",
        fontWeight   : "lighter",
        cursor       : "pointer"
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
    init : function(e, options)
    {
        if (typeof options !== 'undefined') { this.applyOptions(options); }
        this.target = document.getElementById(e);
        if (this.target !== null) {
            this.createOutputArea();
            this.createInputArea();
        }
    },

    applyOptions : function(options)
    {
        for (var optionType in options) {
            switch(optionType) {
                case "tag":
                    for (var tagAttr in options.tag) {
                        this.tagStyle[tagAttr] = options.tag[tagAttr];
                    }
                    break;
                case "input":
                    for (var inputAttr in options.input) {
                        this.inputStyle[inputAttr] = options.input[inputAttr];
                    }
                    break;
                case "output":
                    for (var outputAttr in options.output) {
                        this.outputStyle[outputAttr] = options.output[outputAttr];
                    }
                    break;
                default:
                    this[optionType] = options[optionType];
                    break;
            }
        }
    },

    /**
     * applyStylesFromObject loops through the styles created in
     * the theme objects towards the top of the file and applys
     * those styles to the given element passed.
     *
     * @param element The element to apply styles to
     * @param object The object to get the style data from
     *
     * @return null
     */
    applyStylesFromObject : function(element, object)
    {
        if (this.defaultTheme === true) {
            for (var attr in object) {
                element.style[attr] = object[attr];
            }
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
            output.id = "tagbox-content-output";
            output.className = "tagbox-output";

        this.applyStylesFromObject(output, this.outputStyle);
        this.outputElement = output;
        this.target.appendChild(this.outputElement);
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
            input.id = "tagbox-content-area";
            input.contentEditable = true;

            input.addEventListener('keydown', function (e) {
                tagbox.detectKeyPress(e);
            });

            input.className = "tagbox-input";

        this.applyStylesFromObject(input, this.inputStyle);
        this.inputElement = input;
        this.target.appendChild(this.inputElement);
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
        var content = this.inputElement.textContent;

        if (this.validateTagContent(content) === true) {
            this.inputElement.textContent = "";

            this.showOutputArea();

            var tag = document.createElement("div");
                tag.id = "tagbox-tag-" + this.tagIndex;
                tag.innerHTML = content.trim();

                tag.addEventListener("click", function(e) {
                    tagbox.removeTag(e);
                });

                tag.className = "tagbox-tag";

            this.applyStylesFromObject(tag, this.tagStyle);
            this.outputElement.appendChild(tag);
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
        var tagInput = document.getElementById(
            "tagbox-input-" + e.target.id.replace("tagbox-tag-", "")
        );

        e.target.parentNode.removeChild(e.target);
        tagInput.parentNode.removeChild(tagInput);

        this.tagCount--;
        this.hideOutputArea();
    },

    /**
     * showOutputArea shows the area where tags appear once at least the
     * first tag has been created.
     *
     * @return null
     */
    showOutputArea : function()
    {
        this.outputElement.style.display = "block";
    },

    /**
     * hideOutputArea hides the area where tags are shown if there are
     * no tags to show
     *
     * @return null
     */
    hideOutputArea : function()
    {
        if (this.tagCount === 0) {
            this.outputElement.style.display = "none";
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
