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
            {id:0, name: 'Steak Dinner', calories: 1200},
            {id:1, name: 'Cookie', calories: 200},
            {id:2, name: 'Fish', calories: 1000},
        ],
        currentItem: null,
        totalCalories:0

    }

    return {
        getItems: function () {
            return data.items;
        },
        logData : function () {
            return data;
        }
    }

})();

//UI Controller 
const UIctrl = (function () {

    return {
        populateItemsList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}</strong> <em> ${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //Insert list items
            
            document.querySelector('#item-collection').innerHTML = html;
        }
    }
})();

//App Controller
const app = (function (Itemctrl,UIctrl) {

    return{
        init: function () {
            //Fetch Items
            const items = Itemctrl.getItems();

            //Populate Items
            UIctrl.populateItemsList(items); 
        }
    }
    
})(Itemctrl,UIctrl);

app.init();