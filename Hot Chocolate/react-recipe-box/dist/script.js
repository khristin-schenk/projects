function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}var MenuItem = React.createClass({ displayName: "MenuItem",
  render: function () {

    var disabledStyle = {
      opacity: "0.5",
      cursor: "default" };


    var isActiveItem = this.props.itemIdx === this.props.activeCardIdx && this.props.isEditMode;
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    return /*#__PURE__*/React.createElement("li", {
      onClick: this.handleClick,
      className: this.props.itemIdx === this.props.activeCardIdx && !this.props.isAddMode ? "highlighted" : "",
      style: isDisabled && !isActiveItem ? disabledStyle : null },

    this.props.data.title);

  },
  handleClick: function () {
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    if (!isDisabled) {
      this.props.clickHandler(this.props.itemIdx);
    }
  } });


var Menu = React.createClass({ displayName: "Menu",
  render: function () {
    var disabledStyle = {
      opacity: "0.5",
      cursor: "default" };


    var createMenuItems = function (item, i) {
      return /*#__PURE__*/React.createElement(MenuItem, {
        data: item,
        key: Date.now() + i,
        itemIdx: i,
        clickHandler: this.props.recipeClickHandler,
        activeCardIdx: this.props.activeCardIdx,
        isEditMode: this.props.isEditMode,
        isAddMode: this.props.isAddMode });

    }.bind(this);

    return /*#__PURE__*/React.createElement("div", {
      className: "menu" }, /*#__PURE__*/
    React.createElement("ul", { className: "clearfix" },
    this.props.data.map(createMenuItems), /*#__PURE__*/
    React.createElement("li", {
      onClick: !this.props.isAddMode && !this.props.isEditMode ? this.handleClick : null,
      className: "animated tada" + (this.props.isAddMode ? " highlighted" : ""),
      style: this.props.isEditMode ? disabledStyle : null }, "Add")));






  },
  handleClick: function () {
    this.props.addClickHandler();
  } });


var CardFront = React.createClass({ displayName: "CardFront",
  render: function () {

    var cardImageStyle = {
      background: 'url(' + this.props.data.imageUrl + ') center center no-repeat',
      backgroundSize: 'cover' };


    var createIngredients = function (item, i) {
      return /*#__PURE__*/React.createElement("li", { key: Date.now() + i },
      item);

    };
    return /*#__PURE__*/React.createElement("div", { className: this.props.isEditMode ? "hidden" : "" }, /*#__PURE__*/
    React.createElement("div", { style: cardImageStyle, className: "image" }), /*#__PURE__*/
    React.createElement("div", { className: "content" }, /*#__PURE__*/
    React.createElement("div", { className: "recipe-content" }, /*#__PURE__*/
    React.createElement("h3", null, this.props.data.title), /*#__PURE__*/
    React.createElement("ul", null,
    this.props.data.ingredients.map(createIngredients))), /*#__PURE__*/


    React.createElement("div", { className: "button-group" }, /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.props.toggleEditMode }, /*#__PURE__*/React.createElement("i", { className: "fa fa-pencil" }), " Edit"), /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.props.delete }, /*#__PURE__*/React.createElement("i", { className: "fa fa-trash" }), " Delete"))));



  } });


var CardBack = React.createClass({ displayName: "CardBack",
  getInitialState: function () {
    return {
      title: this.props.data.title,
      ingredients: this.props.data.ingredients,
      imageUrl: this.props.data.imageUrl };

  },
  render: function () {
    return /*#__PURE__*/React.createElement("div", { className: this.props.isEditMode ? "" : "hidden" }, /*#__PURE__*/
    React.createElement("h3", null, "Edit Recipe"), /*#__PURE__*/
    React.createElement("form", null, /*#__PURE__*/
    React.createElement("label", null, "Title:", /*#__PURE__*/
    React.createElement("input", {
      onChange: this.handleTitleChange,
      type: "text",
      value: this.state.title }), /*#__PURE__*/

    React.createElement("br", null)), /*#__PURE__*/

    React.createElement("label", null, /*#__PURE__*/React.createElement("span", { className: "textarea-label" }, "Ingredients:"), /*#__PURE__*/
    React.createElement("input", {
      onChange: this.handleIngredientsChange,
      type: "text",
      value: this.state.ingredients.toString() })), /*#__PURE__*/


    React.createElement("label", null, "Image URL:", /*#__PURE__*/
    React.createElement("input", {
      onChange: this.handleImageUrlChange,
      type: "text",
      value: this.state.imageUrl })), /*#__PURE__*/


    React.createElement("div", { className: "button-group" }, /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.handleSave }, /*#__PURE__*/React.createElement("i", { className: "fa fa-floppy-o" }), " Save"), /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.handleUndo }, /*#__PURE__*/React.createElement("i", { className: "fa fa-undo" }), " Undo"))));



  },
  //change this so that the next
  handleTitleChange: function (e) {
    this.setState({ title: e.target.value });
  },
  handleIngredientsChange: function (e) {
    this.setState({ ingredients: e.target.value.split(',') });
  },
  handleImageUrlChange: function (e) {
    this.setState({ imageUrl: e.target.value });
  },
  handleSave: function () {
    this.props.saveTitle(this.state.title);
    this.props.saveIngredients(this.state.ingredients);
    this.props.saveImageUrl(this.state.imageUrl);
    this.props.toggleEditMode();
  },
  handleUndo: function () {
    this.setState({
      title: this.props.data.title,
      ingredients: this.props.data.ingredients });

  } });


var CardAdd = React.createClass({ displayName: "CardAdd",
  render: function () {
    return /*#__PURE__*/React.createElement("div", { className: "card " + (this.props.isAddMode ? "animated pulse" : "hidden") }, /*#__PURE__*/
    React.createElement("h3", null, "Add a Recipe"), /*#__PURE__*/
    React.createElement("form", null, /*#__PURE__*/
    React.createElement("label", null, "Title:", /*#__PURE__*/

    React.createElement("input", {
      type: "text",
      value: this.props.data.title,
      onChange: this.props.updateNextTitle })), /*#__PURE__*/


    React.createElement("label", null, /*#__PURE__*/
    React.createElement("span", { className: "textarea-label" }, "Ingredients:"), /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      placeholder: "add,comma,seperated, ingredients",
      value: this.props.data.ingredients.toString(),
      onChange: this.props.updateNextIngredients })), /*#__PURE__*/


    React.createElement("label", null, "Image URL:", /*#__PURE__*/
    React.createElement("input", {
      type: "text",
      value: this.props.data.imageUrl,
      onChange: this.props.updateNextImageUrl })), /*#__PURE__*/


    React.createElement("div", { className: "button-group" }, /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.props.saveClickHandler }, /*#__PURE__*/React.createElement("i", { className: "fa fa-floppy-o" }), " Save"), /*#__PURE__*/
    React.createElement("span", { className: "button", onClick: this.props.closeClickHandler }, /*#__PURE__*/React.createElement("i", { className: "fa fa-times" }), " Cancel"))));



  },
  closeHandler: function () {

    this.props.closeClickHandler();
  } });


var EditableCard = React.createClass({ displayName: "EditableCard",
  render: function () {
    return /*#__PURE__*/React.createElement("div", { className: "card-wrap" },
    this.props.totalCards < 2 ? null : /*#__PURE__*/React.createElement("div", { className: "card card-stack1" }), /*#__PURE__*/
    React.createElement("div", { className: "card" }, /*#__PURE__*/
    React.createElement(CardFront, _extends({},
    this.props, {
      toggleEditMode: this.props.editClickHandler,
      isEditMode: this.props.isEditMode })), /*#__PURE__*/

    React.createElement(CardBack, _extends({},
    this.props, {
      toggleEditMode: this.props.editClickHandler,
      isEditMode: this.props.isEditMode }))),


    this.props.totalCards < 3 ? null : /*#__PURE__*/React.createElement("div", { className: "card card-stack2" }));

  } });




var helpers = {
  //localStorage test helper from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  storageAvailable: function (type) {
    try {
      var storage = window[type],
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  } };



var testData = [
{
  title: 'Banana Bread',
  ingredients: ['140g softened butter', '140g caster sugar', '2 large eggs', '140g self-raising flour', '1tsp baking powder', '2 very ripe banana', '50g icing powder'],
  imageUrl: 'http://cdn.wholelifestylenutrition.com/wp-content/uploads/Banana-Nut-Bread.jpg' },

{
  title: 'Chilli Con Carne',
  ingredients: ['1tbsp olive oil', '1 onion', '2 garlic cloves', '250g beef mince', '500ml beef stock', '1tsp chilli flakes', '400g tin tomatoes', '2 tins red kidney beans', '200g long grain rice'],
  imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--1001451_6.jpg' },

{
  title: 'Sausage & Bean Caserole',
  ingredients: ['12 pork sausages', '6 rashers streaky bacon', '2 onions', '400g can tomatoes', '300ml chicken stock', '400g mixed beans'],
  imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--901576_11.jpg' },

{
  title: 'Gravy',
  ingredients: ['meat juices', '2 tbsp liquid meat fat', '1 pint stock', '2tsp gravy browning'],
  imageUrl: 'https://40.media.tumblr.com/086f28f810a04d33cd6a685eabdb164d/tumblr_inline_nmjcqrBk7j1tr4e0j_1280.jpg' }];



var RecipeBox = React.createClass({ displayName: "RecipeBox",
  getInitialState: function () {
    return {
      editMode: false,
      addMode: false,
      activeCardIdx: 0,
      data: testData,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: '' } };


  },
  componentWillMount: function () {
    var storageAvailable = helpers.storageAvailable;
    if (storageAvailable('localStorage')) {
      if (!localStorage.thepetedRecipes) {
        localStorage.thepetedRecipes = JSON.stringify(this.state.data);
      } else {
        var obj = JSON.parse(localStorage.thepetedRecipes);
        this.setState({ data: obj });
      }
    } else
    {
      return;
    }
  },
  render: function () {
    var filterByActiveIndex = function (data, i) {
      return i === this.state.activeCardIdx;
    }.bind(this);

    var makeEditableCard = function (card, i) {
      return /*#__PURE__*/React.createElement(EditableCard, {
        key: Date.now() + i + 100,
        data: card,
        totalCards: this.state.data.length,
        saveTitle: this.updateRecipeTitle,
        saveIngredients: this.updateRecipeIngredients,
        saveImageUrl: this.updateImageUrl,
        editClickHandler: this.toggleEditMode,
        isAddMode: this.state.addMode,
        isEditMode: this.state.editMode,
        delete: this.removeRecipe });

    }.bind(this);

    var disabledStyle = {
      opacity: "0.3",
      cursor: "default" };


    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", { className: "row" }, /*#__PURE__*/
    React.createElement("div", { className: "card-area clearfix" }, /*#__PURE__*/
    React.createElement("div", { className: "col col-1" }, /*#__PURE__*/
    React.createElement("i", { className: "cycle fa fa-chevron-left fa-2x",
      onClick: this.cycleLeft,
      style: this.state.addMode || this.state.editMode ? disabledStyle : null })), /*#__PURE__*/



    React.createElement("div", { className: "col col-2" },
    this.state.data.length ?
    !this.state.addMode &&
    this.state.data.filter(filterByActiveIndex).map(makeEditableCard) : /*#__PURE__*/
    React.createElement("span", null, "No recipes!"), /*#__PURE__*/
    React.createElement(CardAdd, {
      isAddMode: this.state.addMode,
      closeClickHandler: this.toggleAddMode,
      saveClickHandler: this.addRecipe,
      data: this.state.nextItem,
      updateNextIngredients: this.updateNextIngredients,
      updateNextTitle: this.updateNextTitle,
      updateNextImageUrl: this.updateNextImageUrl })), /*#__PURE__*/


    React.createElement("div", { className: "col col-3" }, /*#__PURE__*/
    React.createElement("i", { className: "cycle fa fa-chevron-right fa-2x",
      onClick: this.cycleRight,
      style: this.state.addMode || this.state.editMode ? disabledStyle : null })))), /*#__PURE__*/







    React.createElement(Menu, {
      data: this.state.data,
      recipeClickHandler: this.changeActiveCard,
      addClickHandler: this.toggleAddMode,
      isAddMode: this.state.addMode,
      isEditMode: this.state.editMode,
      activeCardIdx: this.state.activeCardIdx }));


  },
  changeActiveCard: function (idx) {
    this.setState({
      activeCardIdx: idx,
      addMode: false });

  },
  cycleLeft: function () {
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === 0) {
        modifier = this.state.data.length - 1;
      } else {
        modifier = -1;
      }
      this.setState({
        activeCardIdx: this.state.activeCardIdx + modifier });

    }
  },
  cycleRight: function () {
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === this.state.data.length - 1) {
        modifier = 0;
      } else {
        modifier = this.state.activeCardIdx + 1;
      }
      this.setState({
        activeCardIdx: modifier });

    }
  },
  updateRecipeIngredients: function (ingredients) {
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].ingredients = ingredients;

    this.setState({
      data: obj },
    this.updateLocalStorage);
  },
  updateImageUrl: function (imageUrl) {
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].imageUrl = imageUrl;

    this.setState({
      data: obj },
    this.updateLocalStorage);
  },
  updateRecipeTitle: function (title) {
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].title = title;

    this.setState({
      data: obj },
    this.updateLocalStorage);
  },
  updateNextTitle: function (e) {
    var obj = this.state.nextItem;
    obj.title = e.target.value;
    this.setState({
      nextItem: obj });

  },
  updateNextIngredients: function (e) {
    var obj = this.state.nextItem;
    obj.ingredients = e.target.value.split(',');
    this.setState({
      nextItem: obj });

  },
  updateNextImageUrl: function (e) {
    var obj = this.state.nextItem;
    obj.imageUrl = e.target.value;
    this.setState({
      nextItem: obj });

  },
  addRecipe: function () {
    var placeholder = 'http://www.jamesbeard.org/sites/default/files/styles/recipe_335x285/public/default_images/recipe_placeholder.jpg?itok=10fpzziS';
    var recipes = this.state.data;
    var nextRecipe = {
      title: this.state.nextItem.title || 'Untitled',
      ingredients:
      this.state.nextItem.ingredients.length ?
      this.state.nextItem.ingredients :
      ['No ingredients yet!'],
      imageUrl: this.state.nextItem.imageUrl || placeholder };


    recipes.push(nextRecipe);
    this.setState({
      addMode: false,
      data: recipes,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: '' },

      activeCardIdx: this.state.data.length - 1 },
    this.updateLocalStorage);
  },
  updateLocalStorage: function () {
    var storageAvailable = helpers.storageAvailable;
    if (storageAvailable('localStorage')) {
      localStorage.thepetedRecipes = JSON.stringify(this.state.data);
    } else
    {
      return;
    }
  },
  removeRecipe: function () {
    var cpArray = this.state.data.slice(0);
    cpArray.splice(this.state.activeCardIdx, 1);
    this.setState({
      data: cpArray,
      activeCardIdx: Math.max(this.state.activeCardIdx - 1, 0) },
    this.updateLocalStorage);
  },
  toggleAddMode: function (title) {
    this.setState({
      addMode: !this.state.addMode,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: '' } });


  },
  toggleEditMode: function () {
    this.setState({
      editMode: !this.state.editMode });

  } });


var element = React.createElement(RecipeBox);

ReactDOM.render(element, document.querySelector('.container'));