//Storage Controller
const Storagectrl = (function () {
    return{
        storeItem:function (item) {
            let items = [];
            if (localStorage.getItem('items')===null) {
                items=[];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getItemsFromStorage: function name(params) {
            let items;
          if (localStorage.getItem('items')===null) {
              items=[];
          }else{
              items= JSON.parse(localStorage.getItem('items'));
          }
          
          return items;
        }
    }
})();


//Item Controller 
const Itemctrl = (function () {
    const Item = function (id,name,calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: Storagectrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories:0

    }

    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name,calories) {
            let Id;
            if (data.items.length > 0) {
                Id = data.items[data.items.length - 1].id + 1;
            } else {
                Id = 0;
            }

            calories = parseInt(calories);

            newItem = new Item(Id,name,calories);

            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;

            data.items.forEach(function (item) {
                if (item.id === id ) {
                    found = item;
                } 
            });
            return found;
        },

        updateItem: function (name,calories) {
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
                return item;
            });
        },

        deleteItem: function (id) {
            //Get Ids
            const ids = data.items.map(function (item) {
                return item.id;

            });

            const index = ids.indexOf(id);

            data.items.splice(index,1);
        },

        clearAllItems: function () {
            data.items = [];  
        },
        
        setCurrentItem: function (item) {
          data.currentItem = item;  
        },

        getCurrentItem: function () {
          return data.currentItem;  
        },
        getTotalCalories: function () {
            let total = 0;

            data.items.forEach(function (item) {
                total += item.calories
            })

            data.totalCalories = total;

            return data.totalCalories;
        },
        logData : function () {
            return data;
        }
    }

})();

//UI Controller 
const UIctrl = (function () {

    const UIselectors = {
        itemList: '#item-collection',
        addBtn : '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn:'.clear-btn'

    }

    return {
        populateItemsList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em> ${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //Insert list items
            
            document.querySelector(UIselectors.itemList).innerHTML = html;
        },

        getItemInput: function (params) {
          return{
              name:document.querySelector(UIselectors.itemNameInput).value,
              calories:document.querySelector(UIselectors.itemCaloriesInput).value
          }  
        },

        addListItem: function(item) {

            document.querySelector(UIselectors.itemList).style.display = 'block';
            //Create li elements
            const li = document.createElement('li');

            //Add class name
            li.className = 'collection-item';

            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

            document.querySelector(UIselectors.itemList).insertAdjacentElement('beforeend',li)
        },

        updateListItem: function (item) {
          let listItems = document.querySelectorAll(UIselectors.listItems);
          
          listItems = Array.from(listItems);

          listItems.forEach(function (listItems) {
              const itemID = listItem.getAttribute('id');

              if(itemID === `item-${item.id}`){
                  document.querySelector(`#${item.id}`).innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                  </a>`;;
              }
          })
        },
        getSelectors: function() {
            return UIselectors;
        }, 

        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        removeItems: function () {
          let listItems = document.querySelectorAll(UIselectors.listItems)
          
          //Node list to Array
          listItems = Array.from(listItems);

          listItems.forEach(function (item) {
              item.remove();
          })
        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = '';
            document.querySelector(UIselectors.itemCaloriesInput).value = '';
        },

        clearEditState: function () {
          UIctrl.clearInput();
          document.querySelector(UIselectors.backBtn).style.display = 'none';
          document.querySelector(UIselectors.updateBtn).style.display = 'none';
          document.querySelector(UIselectors.deleteBtn).style.display = 'none'; 
          document.querySelector(UIselectors.addBtn).style.display = 'inline'; 
        },

        showEditState: function () {
            document.querySelector(UIselectors.backBtn).style.display = 'inline';
            document.querySelector(UIselectors.updateBtn).style.display = 'inline';
            document.querySelector(UIselectors.deleteBtn).style.display = 'inline'; 
            document.querySelector(UIselectors.addBtn).style.display = 'none'; 
          },

        showTotalCalories: function (totalCalories) {
            document.querySelector(UIselectors.totalCalories).textContent = totalCalories;
        },

        hideList: function () {
            document.querySelector(UIselectors.itemList).style.display = 'none';
        },

        addItemToForm: function () {
            document.querySelector(UIselectors.itemNameInput).value = Itemctrl.getCurrentItem().name;
            document.querySelector(UIselectors.itemCaloriesInput).value = Itemctrl.getCurrentItem().calories;
            UIctrl.showEditState(); 
        }
    }

   
})();

//App Controller
const app = (function (Itemctrl,UIctrl,Storagectrl) {
    const loadEventListeners = function () {
        const UIselectors = UIctrl.getSelectors();
        document.querySelector(UIselectors.addBtn).addEventListener('click',itemAddSubmit);

        document.querySelector(UIselectors.itemList).addEventListener('click',itemEditClick);

        document.querySelector(UIselectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        document.querySelector(UIselectors.backBtn).addEventListener('click',UIctrl.clearEditState);

        document.querySelector(UIselectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        document.querySelector(UIselectors.clearBtn).addEventListener('click',clearAllItemsClick);

        document.addEventListener('keypress',function (e) {
            if(e.keyCode === 13 || e.which === 13){

                e.preventDefault();
                return false;
            }
        })
    }

    const itemAddSubmit = function (e) {
        //Item Input
        const input = UIctrl.getItemInput();
        if (input.name === '' && input.calories === ''){
            alert('Enter valid meal and corresponding calories');
        }else{            
            const newItem = Itemctrl.addItem(input.name,input.calories);
            UIctrl.addListItem(newItem);

            const totalCalories = Itemctrl.getTotalCalories();

            UIctrl.showTotalCalories(totalCalories);

            Storagectrl.storeItem(newItem);

            UIctrl.clearInput();
        }

        
        e.preventDefault();
    }

    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);

            const itemToEdit = Itemctrl.getItemById(id);

            Itemctrl.setCurrentItem(itemToEdit);

            UIctrl.addItemToForm();
        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        const input = UIctrl.getItemInput();

        const updatedItem = Itemctrl.updateItem(input.name,input.calories);

        UIctrl.updateListItem(updatedItem);

        const totalCalories = Itemctrl.getTotalCalories();

        UIctrl.showTotalCalories(totalCalories);

        UIctrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function (e) {
        const currentItem = Itemctrl.getCurrentItem();

        Itemctrl.deleteItem(currentItem.id);

        UIctrl.deleteListItem(currentItem.id);

        const totalCalories = Itemctrl.getTotalCalories();

        UIctrl.showTotalCalories(totalCalories);

        UIctrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function (e) {
        const totalCalories = Itemctrl.getTotalCalories();

        UIctrl.showTotalCalories(totalCalories);

        Itemctrl.clearAllItems();

        UIctrl.removeItems();

        UIctrl.hideList();
    }

    return{
        init: function () {
            UIctrl.clearEditState();

            //Fetch Items
            const items = Itemctrl.getItems();

            if (items.length === 0) {
                UIctrl.hideList();
            } else {
                //Populate Items
            UIctrl.populateItemsList(items); 
            }

            const totalCalories = Itemctrl.getTotalCalories();

            UIctrl.showTotalCalories(totalCalories);


            loadEventListeners();
        }
    }
    
})(Itemctrl,UIctrl,Storagectrl);

app.init();