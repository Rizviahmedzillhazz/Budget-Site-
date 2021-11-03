


//IIFE using closures
//BUDGET controller
var bugetController=(function(){

//some code

 //fubtion Constructors for Expense and Income 

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

};

Expense.prototype.getPercentage=function(){

    return this.percentage;

};

 var Income=function(id,description,value){

    this.id=id;
    this.description=description;
    this.value=value;


 };


 var calculateTotal=function(type){


    var sum=0;

    //for each takes current value, current index , and complete array as parameters
    data.allItems[type].forEach(function(cur){

        sum+=cur.value;
    });
    //insert all the income. expenses to totals
    data.totals[type]=sum;



};

 var data ={


    allItems:{
        exp:[],
        inc:[]

    },
    totals:{

        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1

 };


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
        //ids=[1 2 3 4 6 8]
        //id=6
        //index=4
        //map is similar to for each containing a callback function with param current element, current index , full array
        //difference is ma p returns a entire a new array
        ids= data.allItems[type].map(function(current){

            return current.id;
        });

        index=ids.indexOf(id);

        if(index!==-1){

            //splice takes the index and number of value wannda delete
            data.allItems[type].splice(index,1);

        }

    },



    calculateBudget:function(){

        //calculate total expense/income

        calculateTotal('exp');
        calculateTotal('inc');

        //budget
        data.budget=data.totals.inc-data.totals.exp;

        //calculate percentage
        if(data.totals.inc>0){
        data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
        else{
            data.percentage=-1;
        }



       


    },


    calculatePercentages:function(){

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

            cur.calcPercentage(data.totals.inc); 
        });


    },

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
        totalIncome:data.totals.inc,
        totalExpense:data.totals.exp,
        percentage:data.percentage
        }

    },

    testing:function(){

        console.log(data);
    }



 };





})();





//UI COntroller
var UIController=(function(){

//some code
//store DOM classes

var DOMstrings={

    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn:'.add__btn',
    incomeContainer:'.income__list',
    expenseContainer:'.expenses__list',

    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expenseLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage',


    container:'.container',


    expensePercentageLabel:'.item__percentage',

    monthTitle:'.budget__title--month'


};

var formatNumber=function(num,type){

    /*
    + or - before number 
    exactly 2 decimal points
    coma separating the thousands

    2310.4567->+2,310.46
    2000->2,000.00
    */

    var numSplit,int,decimal,type;

    num=Math.abs(num); // takes the absolute number and stores it no sign 
    num=num.toFixed(2);

    numSplit=num.split('.');

    int=numSplit[0];
    

    if(int,length>3){
        int=int.substr(0,1)+','+int.substr(1,3);// input 2310, output 2,310
        int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);//input 23510 output 23,510
    } 

    decimal=numSplit[1];

    

    return (type ==='exp' ? sign='-' : sign='+'+' ')+int+'.'+decimal;

}

var nodelistForEach=function(list,callback){

    for(var i=0;i<list.length;i++){

        callback(list[i],i);
    }
};








//Read data 
 return{

    getinput:function(){

        return{

            type: document.querySelector(DOMstrings.inputType).value,//will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat to convert string to float
        };

        
    },

    addListItem:function(obj,type){

        var html,newHTML,element;

        if(type==='inc'){
        // create HTML string with placeholder
        element=DOMstrings.incomeContainer;
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else if(type==='exp'){
            element=DOMstrings.expenseContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        //Replace the placeholder text with some actual data

        newHTML=html.replace('%id%',obj.id);
        newHTML=newHTML.replace('%description%',obj.description);
        newHTML=newHTML.replace('%value%',formatNumber(obj.value,type));

        //insert the html into the DOM

        document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);




    },

    deleteListITEM:function(selectorID){

        var el=document.getElementById(selectorID);
        el.parentNode.removeChild(el);


    },



    displayBudget:function(obj){

        var type;
        obj.budget>0 ? type='inc' : type='exp';
        document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
        document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber (obj.totalIncome,'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber( obj.totalExpense,'exp');
       

        if(obj.percentage>0){
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
        }else{

            document.querySelector(DOMstrings.percentageLabel).textContent='---';
        }
        


    },



    displayPercentages:function(percentageArray){

        var fields=document.querySelectorAll(DOMstrings.expensePercentageLabel);


        

        nodelistForEach(fields,function(current,index){

            if(percentageArray[index]>0){
                current.textContent=percentageArray[index]+'%';
            }else{
                current.textContent='---';
            }

        });

    },



    //to clear input fields 

    clearfields:function(){
         
        var fields,fieldArr;

        fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
        //returns a list
        //console.log(fields);
        //convert the list to array 
        fieldArr=Array.prototype.slice.call(fields);
        //console.log(fieldArr);



        fieldArr.forEach(function(current,index,array) {
                current.value='';
        });


        fieldArr[0].focus();//[0] indicates to focus on 0 index which is description in the array



    },

    displayMonth:function(){

        var now,year,month,months;

        now=new Date();
        //var chrismas=new Date(2016,11,25);
        months=['January','February','March','April','May','June','July','August','September','October','November','December'];
        month=now.getMonth();
        year=now.getFullYear();
        document.querySelector(DOMstrings.monthTitle).textContent=months[month] + ' '+year;


    },

    // to change color of UX using +/- 
    changeType:function(){

        var fields=document.querySelectorAll(DOMstrings.inputType+','+
                                            DOMstrings.inputDescription+','+
                                            DOMstrings.inputValue);

        nodelistForEach(fields,function(cur){

            cur.classList.toggle('red-focus');
        })

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');


    },
   
 


    getDOMstrings:function(){

        return DOMstrings;
            
        
    }
 };






})();






//Global App Controller
var controller=(function(bugetctrl,UIctrl){

    //Event Listeners Function
    var setupEventListeners=function(){



        var DOM =UIctrl.getDOMstrings();// to get dom strings to use in controller

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    

        // key press enter event
    
        document.addEventListener('keypress',function(event){
    
            
            if(event===13 || event.which===13){
                
                ctrlAddItem();
    
    
            }
    
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        //change event
        document.querySelector(DOM.inputType).addEventListener('change',UIController.changeType);

    };



    var updateBudget=function(){


        //1.Calculate the budget
        bugetController.calculateBudget();
        //2.return the budget
        var budget=bugetController.getBudget();

        ////3.Display the budget
        //console.log(budget);
        UIController.displayBudget(budget);

    };


    var updatePercentage=function(){


        //1.calculate the percentage
        bugetController.calculatePercentages();

        //2.Read Percentage from budget Controller
        var percentages=bugetController.getPercentages();

        //3. Update the UI with the new Percentage
        console.log(percentages);
        UIController.displayPercentages(percentages);

    };

    

   var ctrlAddItem = function(){
        
    
        var input,newItem;
        
        //1. Get the filed input data 
        input=UIctrl.getinput();
        //console.log(input); 

        // to validate so that description and value is not empty and > 0 and isNan is true when value is nan  so !isNaN returns true when input is actualy a number
        if(input.description !=="" && !isNaN(input.value) && input.value>0 ){


             //2.Add the item to the budget controller
                newItem=bugetController.addItem(input.type,input.description,input.value);


            //3.Add the item to UI

                UIController.addListItem(newItem,input.type);

            //4.clear input fields
                UIctrl.clearfields();

            //5.update budget
                updateBudget();

            //6.Calculate and update percentage
            updatePercentage();


        }

       

        
   }


   var ctrlDeleteItem=function(event){

    
    var itemID,splitID,type,ID;
    // to ger id of parentnode
    itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    if(itemID){

        splitID=itemID.split('-');
        type=splitID[0]//save type=inc/exp from 0 index of splitId
        ID=parseInt( splitID[1])//save ID=  from 1 index of splitId
        
        //1. Delete itmes from data structure 
        bugetController.deleteItem(type,ID);
        //2.Delete the item from the UI
        UIController.deleteListITEM(itemID);

        //3.Update and show the new budget
        updateBudget();




    }
  

   };

   return{
    //


    //intialization funtion for the APP
    init:function(){
        console.log('App has Started');
        UIController.displayMonth();
        UIController.displayBudget( {
            budget:0,    
            totalIncome:0,
            totalExpense:0,
            percentage:-1
            });
        setupEventListeners();
        

    }
   }


   




})(bugetController,UIController);


controller.init();