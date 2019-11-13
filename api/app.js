//Storage Controller

//Item Controller 
const Itemctrl = (function () {
    const Item = function (id,name,calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
            // {id:0, name: 'Steak Dinner', calories: 1200},
            // {id:1, name: 'Cookie', calories: 200},
            // {id:2, name: 'Fish', calories: 1000},
        ],
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
        totalCalories: '.total-calories'

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
        getSelectors: function() {
            return UIselectors;
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
const app = (function (Itemctrl,UIctrl) {
    const loadEventListeners = function () {
        const UIselectors = UIctrl.getSelectors();
        document.querySelector(UIselectors.addBtn).addEventListener('click',itemAddSubmit);
        document.querySelector(UIselectors.itemList).addEventListener('click',itemUpdateSubmit);
    }

    const itemAddSubmit = function (e) {
        //Item Input
        const input = UIctrl.getItemInput();
        if (input.name === '' && input.calories === ''){
            alert('Enter valid meal and corresponding calories');
        }else{            
            const newitem = Itemctrl.addItem(input.name,input.calories);
            UIctrl.addListItem(newItem);

            const totalCalories = Itemctrl.getTotalCalories();

            UIctrl.showTotalCalories(totalCalories);

            UIctrl.clearInput();
        }

        
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
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
    
})(Itemctrl,UIctrl);

app.init();