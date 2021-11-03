
var budgetController=(function(){

    var Expense=function(id,description,value){


        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
     };

     Expense.prototype.calcPercentage=function(totalIncome){

        if(totalIncome>0){

            this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }

     }

     Expense.prototype.getPercentage=function(){

        return this.percentage;
     }

     var Income=function(id,description,value){


        this.id=id;
        this.description=description;
        this.value=value;
     };

     var calculateTotal=function(type){

        var sum=0;
        //for each takes current value, current index , and complete array as parameters
        data.allItems[type].forEach(function(cur){

            sum=sum+cur.value;


        });
        data.totalItems[type]=sum;

     };


     var data={

        allItems:{

            exp:[],
            inc:[]
        },

        totalItems:{

            exp:0,
            inc:0
        },

        budget:0,
        percentage:-1
     }




     return{

        addItem:function(type,des,val){


            var newItem,ID;
    
            //[1 2 3 4 5] next should be 6
            //[1 2 4 6 8] next should be 9
            //Id=last id +1
            //Create new ID
            if(data.allItems[type].length>0){
    
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
        
            }else{
                ID=0;
            }
    
    
    
            //create new item based on 'exp' or 'inc'
            if(type==='exp'){
                newItem=new Expense(ID,des,val);
                
            }else if(type==='inc'){
    
                newItem=new Income(ID,des,val);
            }
    
            //pusht it into data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        
        
    

        deleteItem:function(type,id){

            var ids,index;

            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            index=ids.indexOf(id);

            if(index!==-1){

                data.allItems[type].splice(index,1);
            }
        },
    
        
        calculateBudget:function(){


            // calculate total income and expenses
            
                calculateTotal('exp');
                calculateTotal('inc');
            //calculate the budget : income- expenses
            data.budget=data.totalItems.inc-data.totalItems.exp;

            //calculate percentage
            if(data.totalItems.inc>0){
            data.percentage=Math.round((data.totalItems.exp/data.totalItems.inc)*100);
            }else{
                data.percentage=-1;
            }

        },

        calculatepercentages:function(){

            /*
        a=10
        b=20
        c=40
        income=100
        a=10/100=10%
        b=20/100=20%
        c=40/100=40%
        */

            data.allItems.exp.forEach(function(cur){

                cur.calcPercentage(data.totalItems.inc);
            }


            )},

        
        getPercentages:function(){

              // loop thorough exp array and calls getpercentage
                var allPercentage=data.allItems.exp.map(function(cur){

                    return cur.getPercentage();
                });
                return allPercentage;
        },

        getBudget:function(){

            return{

                budget:data.budget,
                totalInc:data.totalItems.inc,
                totalExpense:data.totalItems.exp,
                percentage:data.percentage

            }


        },

        testing:function(){

            console.log(data);
        }



     }




})();




var UIController=(function(){

var DOMStrings={
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn:'.add__btn',
    incomeContainer:'.income__list',
    expenseContainer:'.expenses__list',
    budgetLabel:'.budget__value',
    expenseLabel:'.budget__expenses--value',
    incomeLabel:'.budget__income--value',    
    percentageLabel:'.budget__expenses--percentage',

    container:'.container',

    expensePecentageLabel:'.item__percentage'



};




return{


    getInput:function(){
    return{


        type:document.querySelector(DOMStrings.inputType).value,
        description:document.querySelector(DOMStrings.inputDescription).value,
        value:parseFloat( document.querySelector(DOMStrings.inputValue).value)//parseFloat to convert string to float




    }},


    




    addListItem:function(obj,type){

        var html,newHTML,element;

        if(type==='inc'){
        // create HTML string with placeholder
        element=DOMStrings.incomeContainer;
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else if(type==='exp'){
            element=DOMStrings.expenseContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        //Replace the placeholder text with some actual data

        newHTML=html.replace('%id%',obj.id);
        newHTML=newHTML.replace('%description%',obj.description);
        newHTML=newHTML.replace('%value%',obj.value);

        //insert the html into the DOM

        document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);




    },

    deleteListITEM:function(selectorID){

        var el=document.getElementById(selectorID);
        el.parentNode.removeChild(el);


    },

    displayBudget:function(obj){



        document.querySelector(DOMStrings.budgetLabel).textContent=obj.budget;
        document.querySelector(DOMStrings.incomeLabel).textContent=obj.totalInc;
        document.querySelector(DOMStrings.expenseLabel).textContent=obj.totalExpense;

        if(obj.percentage>0){
            document.querySelector(DOMStrings.percentageLabel).textContent=obj.percentage+'%';
        }else{

            document.querySelector(DOMStrings.percentageLabel).textContent='---';
        }
        
        


    },


    displayPercentages:function(percentageArray){


        var fields=document.querySelectorAll(DOMStrings.expensePecentageLabel);

        var nodelistForEach=function(list,callback){

            for(var i=0;i<list.length;i++){

                callback(list[i],i);
            }

        };

        nodelistForEach(fields,function(current,index){


            if(percentageArray[index]>0){
                current.textContent=percentageArray[index]+'%';
            }else{
                current.textContent='---';
            }

        }


        );
    },




    clearfields:function(){



        var fields,fieldArr;

        fields=document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
        fieldArr=Array.prototype.slice.call(fields);

        fieldArr.forEach(function(current,index,array){
            
            current.value='';

        });

        fieldArr[0].focus();

       

    },



    getDOM:function(){

        return DOMStrings;
    }
}



})();



var controller=(function(budgetctrl,UIctrl){




    var eventListeners=function(){
        var DOM=UIController.getDOM();
        document.querySelector(DOM.inputBtn).addEventListener('click',controllerAddItem);


 // key press enter event

 document.addEventListener('keypress',function(event){

        
    if(event===13 || event.which===13){
        
        controllerAddItem();


    }

});

    document.querySelector(DOM.container).addEventListener('click',controllerDeleteItem);


    }


    var updateBudget=function(){


        //1.Calculate the budget

        budgetController.calculateBudget();

        //2.return the budget

        var budget=budgetController.getBudget();
        
        //5.Display the budget
        console.log(budget);
        UIController.displayBudget(budget);

    }


    var updatePercentage=function(){

        //1.calculate the percentage
        budgetController.calculatepercentages();

        //2.Read Percentage from budget Controller
        var percentages=budgetController.getPercentages();

        //3. Update the UI with the new Percentage
        console.log(percentages);
        UIController.displayPercentages(percentages);

    }





var controllerAddItem=function(){


    var input,newItem;
    //1. Get the filed input data 
    input=UIController.getInput();
    console.log(input);




        if(input.description !=='' && !isNaN(input.value) && input.value>0){

         //2.Add the item to the budget controller


        newItem=budgetController.addItem(input.type,input.description,input.value);


        //3.Add the item to UI

    
        UIController.addListItem(newItem,input.type);

        //4.clear input field

        UIController.clearfields();

        //5.Update Budget
        updateBudget();
        }

        //6.Calculate and update percentage
        updatePercentage();

};



var controllerDeleteItem=function(event){

    var itemID,splitID,type,ID;
    // to ger id of parentnode
    itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    if(itemID){

        splitID=itemID.split('-');
        type=splitID[0]//save type=inc/exp from 0 index of splitId
        ID=parseInt( splitID[1])//save ID=  from 1 index of splitId
        
        //1. Delete itmes from data structure 
        budgetController.deleteItem(type,ID);
        //2.Delete the item from the UI
        UIController.deleteListITEM(itemID);

        //3.Update and show the new budget
        updateBudget();




    }
}





  

return{
    //


    //intialization funtion for the APP
    init:function(){
        console.log('App has Started');
        UIController.displayBudget( {
            budget:0,    
            totalIncome:0,
            totalExpense:0,
            percentage:-1
            });
            eventListeners();

    }
   }





})(budgetController,UIController);


controller.init();




