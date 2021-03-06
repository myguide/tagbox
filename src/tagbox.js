// tagbox v0.0.5
//
// (c) myguide.io 2015
//
// @package tagbox
// @version 0.0.5
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
    searchResultsElement : null,

    tagSearchResults : [],
    searchTraverseIndex : null,
    selectedResult: null,

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

    searchResultsStyle :
    {
        width      : "100%",
        cssFloat   : "left",
        border     : "thin solid #c9c9c9",
        padding    : "4px",
        borderTop  : "none",
        display    : "none"
    },

    resultStyle :
    {
        height       : "18px",
        width        : "98%",
        cssFloat     : "left",
        marginBottom : "3px",
        marginTop    : "3px",
        padding      : "3px",
        color        : "#444444",
        fontFamily   : "Helvetica",
        fontWeight   : "lighter",
        cursor       : "pointer"
    },

    resultActiveStyle : {
        background   : "#cbd8f2",
        borderRadius : "2px"
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
            this.createSearchResultsArea();
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

            input.addEventListener('keyup', function (e) {
                tagbox.searchPresets();
                tagbox.displaySearchResults(e);
            });

            input.className = "tagbox-input";

        this.applyStylesFromObject(input, this.inputStyle);
        this.inputElement = input;
        this.target.appendChild(this.inputElement);
    },

    createSearchResultsArea : function()
    {
        var searchResults = document.createElement("div");
            searchResults.id = "tagbox-search-results";
            searchResults.className = "tagbox-search-results";
        this.applyStylesFromObject(searchResults, this.searchResultsStyle);
        this.searchResultsElement = searchResults;
        this.target.appendChild(this.searchResultsElement);
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
        if (this.selectedResult !== null) {
            content = this.selectedResult;
        }

        if (this.strict === true) {
             if (this.preset.indexOf(content) < 0) {
                return false;
             }
        }

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
            this.searchTraverseIndex = null;
            this.selectedResult = null;
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
    },

    /**
     * searchPresets loops through the given presets to find anything that
     * matches what is typed into the input area.
     *
     * @return null
     */
    searchPresets : function()
    {
        this.tagSearchResults = [];
        var text = this.inputElement.textContent;
        var regex = new RegExp(".*" + text + ".*");
        for (i = 0; i < this.preset.length; i++) {
            if(regex.test(this.preset[i])) {
                this.tagSearchResults.push(this.preset[i]);
            }
        }
        if (text === "") {
            this.tagSearchResults = [];
            this.searchResultsElement.style.display = "none";
            this.searchTraverseIndex = null;
        }
    },

    /**
     * displaySearchResults creates a new element per result that is found
     * from the searchPresets call. The div is then added to its parent
     * element along with each other search result.
     *
     * @return null
     */
    displaySearchResults : function(e)
    {
        this.searchResultsElement.innerHTML = "";
        if (this.tagSearchResults.length > 0) {
            for (var tag in this.tagSearchResults) {
                var result = document.createElement("div");
                result.textContent = this.tagSearchResults[tag];
                result.id = "tagbox-result-" + tag;
                result.className = "tagbox-result";

                result.addEventListener("click", function(e) {
                    tagbox.clickSearchResult(e);
                });

                this.applyStylesFromObject(result, this.resultStyle);
                this.searchResultsElement.appendChild(result);
                this.searchResultsElement.style.display = "block";
            }
        }
        if (e.which == 40 || e.which == 38) {
            e.preventDefault();
            this.traverseThroughResults(e.which);
        }
    },

    /**
     * traverseThroughResults verifies the key press to detect if the user is
     * traversing up the list of results, or down. An index is set initially.
     * If the index is null, there is no result selected. Any other value
     * represents the fact that one of the search results is selected.
     *
     * @param keypress int The unique id of the key that was pressed
     */
    traverseThroughResults : function(keypress)
    {
        if (keypress == 40) {
            if (this.searchTraverseIndex === null) {
                this.searchTraverseIndex = 0;
            } else if (this.searchTraverseIndex < this.tagSearchResults.length - 1) {
                this.searchTraverseIndex++;
            }
        }
        if (keypress == 38) {
            if (this.searchTraverseIndex !== null && this.searchTraverseIndex >= 0) {
                this.searchTraverseIndex--;
                if (this.searchTraverseIndex == -1) {
                    this.searchTraverseIndex = null;
                }
            }
        }
        this.highlightSearchResult();
    },

    /**
     * highlightSearchResult adds an active class to the result that has been selected
     * 
     * @return null
     */
    highlightSearchResult : function()
    {
        var result = document.getElementById("tagbox-result-" + this.searchTraverseIndex);
        if (result !== null) {
            result.className = "tagbox-result tagbox-active";
            this.applyStylesFromObject(result, this.resultActiveStyle);
            this.selectedResult = result.textContent;
        }
    },

    /**
     * clickSearchResult allows a tag to be appended when a user clicks one of the listed
     * results as appose to traversing up or down the list.
     *
     * @param e The click event
     *
     * @return null
     */
    clickSearchResult : function(e)
    {
        this.selectedResult = e.target.textContent;
        this.appendTag();
        this.tagSearchResults = [];
        this.searchResultsElement.style.display = "none";
        this.searchTraverseIndex = null;
    }
};

