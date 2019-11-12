//Storage Controller

//UI Controller 
const UIctrl = (function () {
    
})();

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
            {id:0, name: 'Fish', calories: 1000},
        ],
        currentItem: null,
        totalCalories:0

    }

    return {
        logData : function () {
            return data;
        }
    }

})();

//App Controller
const app = (function () {

    return{
        init: function () {
            
        }
    }
    
})(Itemctrl,UIctrl);