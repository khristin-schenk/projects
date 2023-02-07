var MenuItem = React.createClass({
  render: function(){

    var disabledStyle = {
      opacity: "0.5",
      cursor: "default"
    };

    var isActiveItem = (this.props.itemIdx === this.props.activeCardIdx) && this.props.isEditMode;    
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    return <li
      onClick={this.handleClick}
      className={this.props.itemIdx === this.props.activeCardIdx && !this.props.isAddMode ? "highlighted" : ""}
      style={(isDisabled && !isActiveItem) ? disabledStyle : null}
      >
      {this.props.data.title}
    </li>
  },
  handleClick: function(){
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    if (!isDisabled){
      this.props.clickHandler(this.props.itemIdx)
      }
    }
});

var Menu = React.createClass({
  render: function(){
    var disabledStyle = {
      opacity: "0.5",
      cursor: "default"
    };

    var createMenuItems = function(item,i){
      return <MenuItem
        data={item}
        key={Date.now() + i}
        itemIdx={i}
        clickHandler={this.props.recipeClickHandler}
        activeCardIdx={this.props.activeCardIdx}
        isEditMode={this.props.isEditMode}
        isAddMode={this.props.isAddMode}
        />
    }.bind(this);

    return <div
      className="menu">
      <ul className="clearfix">
        {this.props.data.map(createMenuItems)}
        <li
          onClick={(!this.props.isAddMode && !this.props.isEditMode) ? this.handleClick : null}
          className={"animated tada" + (this.props.isAddMode ? " highlighted" : "")}
          style={this.props.isEditMode ? disabledStyle : null}
          >
          Add
        </li>
      </ul>

    </div>
  },
  handleClick: function(){
    this.props.addClickHandler();
  }
});

var CardFront = React.createClass({
  render: function(){
   
    var cardImageStyle = {
      background: 'url(' + this.props.data.imageUrl + ') center center no-repeat',
      backgroundSize: 'cover'
    };

    var createIngredients = function(item, i){
      return <li key={Date.now() + i}>
        {item}
      </li>
    };
    return <div className={this.props.isEditMode ? "hidden" : ""}>
        <div style={cardImageStyle} className="image"></div>
        <div className="content">
          <div className="recipe-content">
            <h3>{this.props.data.title}</h3>
            <ul>
              {this.props.data.ingredients.map(createIngredients)}
            </ul>
          </div>
          <div className="button-group">
            <span className="button" onClick={this.props.toggleEditMode}><i className="fa fa-pencil"></i> Edit</span>
            <span className="button" onClick={this.props.delete}><i className="fa fa-trash"></i> Delete</span>
          </div>
      </div>
    </div>
  }
});

var CardBack = React.createClass({
  getInitialState: function(){
    return {
      title: this.props.data.title,
      ingredients: this.props.data.ingredients,
      imageUrl: this.props.data.imageUrl
    }
  },
  render: function(){
    return <div className={this.props.isEditMode ? "" : "hidden"}>
      <h3>Edit Recipe</h3>
      <form>
        <label>Title:
          <input
          onChange={this.handleTitleChange}
          type="text"
          value={this.state.title}
          />
        <br/>
        </label>
        <label><span className="textarea-label">Ingredients:</span>
          <input
          onChange={this.handleIngredientsChange}
          type="text"
          value={this.state.ingredients.toString()}
          />
        </label>
        <label>Image URL:
          <input
          onChange={this.handleImageUrlChange}
          type="text"
          value={this.state.imageUrl}
          />
        </label>
        <div className="button-group">
          <span className="button" onClick={this.handleSave}><i className="fa fa-floppy-o"></i> Save</span>
          <span className="button" onClick={this.handleUndo}><i className="fa fa-undo"></i> Undo</span>
        </div>
       </form>
    </div>
    },
    //change this so that the next
  handleTitleChange: function(e){
    this.setState({title: e.target.value})
  },
  handleIngredientsChange: function(e){
    this.setState({ingredients: e.target.value.split(',')})
  },
  handleImageUrlChange: function(e){
    this.setState({imageUrl: e.target.value})
  },
  handleSave: function(){
    this.props.saveTitle(this.state.title);
    this.props.saveIngredients(this.state.ingredients);
    this.props.saveImageUrl(this.state.imageUrl);
    this.props.toggleEditMode();
  },
  handleUndo: function(){
    this.setState({
      title: this.props.data.title,
      ingredients: this.props.data.ingredients
    });
  }
});

var CardAdd = React.createClass({
  render: function(){
    return <div className={"card " + (this.props.isAddMode ? "animated pulse" : "hidden")}>
      <h3>Add a Recipe</h3>
      <form>
        <label>
          Title:
          <input
            type="text"
            value={this.props.data.title}
            onChange={this.props.updateNextTitle}
            />
        </label>
        <label>
          <span className="textarea-label">Ingredients:</span>
          <input
            type="text"
            placeholder="add,comma,seperated, ingredients"
            value={this.props.data.ingredients.toString()}
            onChange={this.props.updateNextIngredients}
            />
        </label>
        <label>Image URL:
          <input
          type="text"
          value={this.props.data.imageUrl}
          onChange={this.props.updateNextImageUrl}
          />
        </label>
        <div className="button-group">
          <span className="button" onClick={this.props.saveClickHandler}><i className="fa fa-floppy-o"></i> Save</span>
          <span className="button" onClick={this.props.closeClickHandler}><i className="fa fa-times"></i> Cancel</span>
        </div>
      </form>
    </div>
  },
  closeHandler: function(){

    this.props.closeClickHandler();
  }
});

var EditableCard = React.createClass({
  render: function(){
    return <div className="card-wrap">
      {(this.props.totalCards < 2) ? null : <div className="card card-stack1"></div>}
        <div className="card">
        <CardFront
          {...this.props}
          toggleEditMode={this.props.editClickHandler}
          isEditMode={this.props.isEditMode}
          />
        <CardBack
          {...this.props}
          toggleEditMode={this.props.editClickHandler}
          isEditMode={this.props.isEditMode}
          />
        </div>
        {(this.props.totalCards < 3) ? null : <div className="card card-stack2"></div>}
      </div>
  }

});


var helpers = {
//localStorage test helper from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  storageAvailable: function(type) {
  	try {
  		var storage = window[type],
  			x = '__storage_test__';
  		storage.setItem(x, x);
  		storage.removeItem(x);
  		return true;
  	}
  	catch(e) {
  		return false;
  	}
  }
};


var testData = [
  {
    title: 'Banana Bread',
    ingredients: ['140g softened butter','140g caster sugar','2 large eggs', '140g self-raising flour','1tsp baking powder', '2 very ripe banana', '50g icing powder'],
    imageUrl: 'http://cdn.wholelifestylenutrition.com/wp-content/uploads/Banana-Nut-Bread.jpg'
  },
  {
    title: 'Chilli Con Carne',
    ingredients: ['1tbsp olive oil','1 onion', '2 garlic cloves', '250g beef mince', '500ml beef stock', '1tsp chilli flakes', '400g tin tomatoes', '2 tins red kidney beans', '200g long grain rice'],
    imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--1001451_6.jpg'
  },
  {
    title: 'Sausage & Bean Caserole',
    ingredients: ['12 pork sausages', '6 rashers streaky bacon', '2 onions', '400g can tomatoes', '300ml chicken stock', '400g mixed beans'],
    imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--901576_11.jpg'
  },
  {
    title: 'Gravy',
    ingredients: ['meat juices', '2 tbsp liquid meat fat', '1 pint stock', '2tsp gravy browning'],
    imageUrl: 'https://40.media.tumblr.com/086f28f810a04d33cd6a685eabdb164d/tumblr_inline_nmjcqrBk7j1tr4e0j_1280.jpg'
  }
];

var RecipeBox = React.createClass({
  getInitialState: function(){
    return {
      editMode: false,
      addMode: false,
      activeCardIdx: 0,
      data: testData,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      }
    };
  },
  componentWillMount: function(){
    var storageAvailable = helpers.storageAvailable;
    if (storageAvailable('localStorage')) {
      if (!localStorage.thepetedRecipes){
        localStorage.thepetedRecipes = JSON.stringify(this.state.data);
      } else {
        var obj = JSON.parse(localStorage.thepetedRecipes)
        this.setState({data: obj});
      }
    }
    else {
    return;
}
  },
  render: function(){
    var filterByActiveIndex = function(data,i){
      return i === this.state.activeCardIdx
    }.bind(this);

    var makeEditableCard = function(card,i){
      return <EditableCard
          key={Date.now() + i + 100}
          data={card}
          totalCards={this.state.data.length}
          saveTitle={this.updateRecipeTitle}
          saveIngredients={this.updateRecipeIngredients}
          saveImageUrl={this.updateImageUrl}
          editClickHandler={this.toggleEditMode}
          isAddMode={this.state.addMode}
          isEditMode={this.state.editMode}
          delete={this.removeRecipe}
         />
     }.bind(this);

     var disabledStyle = {
       opacity: "0.3",
       cursor: "default"
     };

    return <div>
        <div className="row">
          <div className="card-area clearfix">
            <div className="col col-1">
              <i className="cycle fa fa-chevron-left fa-2x"
                 onClick={this.cycleLeft}
                 style={this.state.addMode || this.state.editMode ? disabledStyle : null}
                 >
              </i>
            </div>
            <div className="col col-2">
              {(this.state.data.length
              ? !this.state.addMode &&
                this.state.data.filter(filterByActiveIndex).map(makeEditableCard)
              : <span>No recipes!</span>)}
              <CardAdd
                isAddMode={this.state.addMode}
                closeClickHandler={this.toggleAddMode}
                saveClickHandler={this.addRecipe}
                data={this.state.nextItem}
                updateNextIngredients={this.updateNextIngredients}
                updateNextTitle={this.updateNextTitle}
                updateNextImageUrl={this.updateNextImageUrl}
                 />
             </div>
             <div className="col col-3">
               <i className="cycle fa fa-chevron-right fa-2x"
                 onClick={this.cycleRight}
                 style={this.state.addMode || this.state.editMode ? disabledStyle : null}
                 >
              </i>
             </div>
            </div>
          </div>


          <Menu
            data={this.state.data}
            recipeClickHandler={this.changeActiveCard}
            addClickHandler={this.toggleAddMode}
            isAddMode={this.state.addMode}
            isEditMode={this.state.editMode}
            activeCardIdx={this.state.activeCardIdx}
            />
    </div>
  },
  changeActiveCard: function(idx){
    this.setState({
      activeCardIdx: idx,
      addMode: false
    })
  },
  cycleLeft: function(){
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === 0) {
        modifier = this.state.data.length - 1;
      } else {
        modifier = -1;
      }
      this.setState({
        activeCardIdx: this.state.activeCardIdx + modifier
      })
    }
  },
  cycleRight: function(){
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === this.state.data.length - 1) {
        modifier = 0;
      } else {
        modifier = this.state.activeCardIdx + 1;
      }
      this.setState({
        activeCardIdx: modifier
      })
    }
  },
  updateRecipeIngredients: function(ingredients){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].ingredients = ingredients;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateImageUrl: function(imageUrl){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].imageUrl = imageUrl;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateRecipeTitle: function(title){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].title = title;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateNextTitle: function(e){
    var obj = this.state.nextItem;
    obj.title = e.target.value;
    this.setState({
      nextItem: obj
    })
  },
  updateNextIngredients: function(e){
    var obj = this.state.nextItem;
    obj.ingredients = e.target.value.split(',');
    this.setState({
      nextItem: obj
    })
  },
  updateNextImageUrl: function(e){
    var obj = this.state.nextItem;
    obj.imageUrl = e.target.value;
    this.setState({
      nextItem: obj
    })
  },
  addRecipe: function(){
    var placeholder = 'http://www.jamesbeard.org/sites/default/files/styles/recipe_335x285/public/default_images/recipe_placeholder.jpg?itok=10fpzziS';
    var recipes = this.state.data;
    var nextRecipe = {
      title: this.state.nextItem.title || 'Untitled',
      ingredients:
      this.state.nextItem.ingredients.length
      ? this.state.nextItem.ingredients
      : ['No ingredients yet!'],
      imageUrl: this.state.nextItem.imageUrl || placeholder
    };

    recipes.push(nextRecipe);
    this.setState({
      addMode: false,
      data: recipes,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      },
      activeCardIdx: this.state.data.length - 1
    },this.updateLocalStorage);
  },
  updateLocalStorage: function(){
    var storageAvailable = helpers.storageAvailable;
   if (storageAvailable('localStorage')) {
     localStorage.thepetedRecipes = JSON.stringify(this.state.data);
   }
   else {
   return;
}
 },
  removeRecipe: function(){
    var cpArray = this.state.data.slice(0);
    cpArray.splice(this.state.activeCardIdx, 1);
    this.setState({
      data: cpArray,
      activeCardIdx: Math.max(this.state.activeCardIdx - 1, 0)
    },this.updateLocalStorage);
  },
  toggleAddMode: function(title){
    this.setState({
      addMode: !this.state.addMode,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      }
    })
  },
  toggleEditMode: function(){
    this.setState({
      editMode: !this.state.editMode
    })
  }
});

var element = React.createElement(RecipeBox);

ReactDOM.render(element, document.querySelector('.container'));

