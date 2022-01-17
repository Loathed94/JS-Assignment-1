const Bank = { //Object representing the bank with member attributes and methods.
    balance: 0, //Customer's balance.
    loan: 0, //Debt, money borrowed goes into balance, this shows debt.
    getALoan: function(){ //The method called when user wishes to get a loan.
        if(this.loan > 0){ //If user has debt no new loan is allowed, so method returns without doing anything.
            return;
        }
        const loanAmount = prompt("How much money do you need to loan from the bank?"); //Asks user to input how much they wish to borrow.
        if(loanAmount === NaN){ //If input is cancelled the method returns without doing any more work.
            return;
        }
        if(this.isLoanAmountAcceptable(loanAmount)){ //A different method is called that makes sure the loan amount is not too much.
            this.balance += parseInt(loanAmount); //If loan amount is acceptable then the loan is granted.
            this.loan = parseInt(loanAmount);
        }
        updateElements(); //HTML is updated when numbers are changed.
    },
    isLoanAmountAcceptable(amount){ //Method checks if loan amount are acceptable.
        if(parseInt(amount) > 2*this.balance){
            return false;
        }
        return true;
    },
    payOffLoanWithBalance(){ //Method uses balance in bank to pay off loans. 
        if(this.balance >= this.loan){ //If balance is greater than debt the debt is zero'd and balance is reduced by debt size.
            this.balance -= this.loan;
            this.loan = 0;
        }
        else{ //If balance is smaller than debt then balance is zero'd and debt is decreased by balance size.
            this.loan -= this.balance;
            this.balance = 0;
        }
        updateElements();
    },
    payOffLoanFromOutside(amount){ //Similar to method above but allows un-specified amounts of cash from outside to pay off (entirely or partially) the debt.
        if(amount > this.loan){
            let residual = amount - this.loan;
            this.loan = 0;
            this.balance += residual; //If money put towards decreasing debt is greater than the debt the rest of the money goes to balance.
        }
        else{
            this.loan -= amount;
        }
        updateElements();
    }
};
const Work = { //An object representing the workplace with its members.
    pay: 0, //Accumulated salary.
    doTheWork: function(){ //Method for performing work and generating pay. 
        this.pay += 100;
        updateElements();
    },
    putPayInBank: function(){ //Puts money in pay into the bank.
        if(Bank.loan > 0){ //If worker is in debt 10% goes to clearing the debt, 90% goes to balance.
            Bank.payOffLoanFromOutside(0.1*this.pay);
            Bank.balance += 0.9*this.pay;
            this.pay = 0;
        }
        else{ //If there is no debt all the cash goes to balance.
            Bank.balance += this.pay;
            this.pay = 0;
        }
        updateElements();
    },
    payOffLoanWithPay: function(){ //This method uses all the money in pay towards clearing debt, any remaining cash goes to balance.
        Bank.payOffLoanFromOutside(this.pay);
        this.pay = 0;
        updateElements();
    }
};
function buy(){ //A function that allows the user to buy a laptop of their choice! (whichever laptop is selected at the time.)
    const price = parseInt(priceElement.innerText);
    if(price <= Bank.balance){ //...assuming they can afford it.
        Bank.balance -= price;
        alert("You are now the proud owner of a brand new "+titleElement.innerText);
    }
    else{
        alert("You cannot afford that! Git gud.")
    }
    updateElements();
}
function updateElements(){ //Any time a user performs an action that can change what is displayed on the webpage this function makes sure to keep the html updated.
    payElement.innerText = Work.pay;
    loanElement.innerText = "Loan: "+Bank.loan; //Update numbers
    balanceElement.innerText = Bank.balance;
    if(Bank.loan > 0){ //Hide or unhide buttons
        payOffLoanElement.style.display = "block";
        payOffLoanWithPayElement.style.display = "block";
        loanElement.style.display = "block";
    }
    else{
        payOffLoanElement.style.display = "none";
        payOffLoanWithPayElement.style.display = "none";
        loanElement.style.display = "none";
    }
};
const baseURL = "https://noroff-komputer-store-api.herokuapp.com/";
const completeAPIURL = baseURL+"computers";
const laptopsElement = document.getElementById("laptops");
const priceElement = document.getElementById("price");
const price2Element = document.getElementById("price2");
const specsElement = document.getElementById("specs");
const descriptionElement = document.getElementById("description"); //A bunch of elements corresponding to items in the html.
const getALoanElement = document.getElementById("getLoan");
const workElement = document.getElementById("work");
const payOffLoanElement = document.getElementById("payOff");
payOffLoanElement.style.display ="none"; //Hidden by default.
const putPayInBankElement = document.getElementById("putPayInBank");
const payOffLoanWithPayElement = document.getElementById("payOffLoanWithPay");
payOffLoanWithPayElement.style.display = "none";
const balanceElement = document.getElementById("balance");
balanceElement.innerText = Bank.balance;
const loanElement = document.getElementById("loan");
loanElement.innerText = "Loan: "+Bank.loan; //Default values printed.
loanElement.style.display = "none";
const payElement = document.getElementById("pay");
payElement.innerText = Work.pay;
const buyElement = document.getElementById("buy");
const imageElement = document.getElementById("image");
const titleElement = document.getElementById("title");
let currentSpecs = []; //An array storing specs currently displayed in the html. Used to keep track of which specs are used before new ones take over to make it easier for the program to remove old childNode-specs.
//const images = [];

let laptops = []; //The array storing the laptop-objects from the .json fetch.
fetch(completeAPIURL) //Fetch the API-promise.
.then(response => response.json()) //Extract .json from Promise
.then(data => laptops = data) //Store data from .json in laptops array.
.then(laptops => addLaptopsToList(laptops)); //Send laptops array to a function shown below.

function addLaptopsToList(laptops){ //Laptops are sent to this function.
    for (const laptop of laptops) { //Laptops are looped over, selected one by one.
        const laptopElement = document.createElement("option"); //For each laptop an element is created with "option" type chosen for html-select.
        laptopElement.value = laptop.id; //value of element set to laptop's unique id.
        laptopElement.appendChild(document.createTextNode(laptop.title)); //Name of laptop added to element as a childNode.
        laptopsElement.appendChild(laptopElement); //laptop element added to greater element of all laptops (notice slight difference in name)
    }
    priceElement.innerText = laptops[0].price;
    price2Element.innerText = laptops[0].price; 
    descriptionElement.innerText = laptops[0].description; //Default price and description added to html at start.
    for (const spec of laptops[0].specs) { //Same thing for specs, but as unspecified amount of list items
        addSpecToHTML(spec);
    }
    imageElement.src = baseURL + laptops[0].image;
    titleElement.innerText = laptops[0].title;
}
function handleLaptopListChange(e){ //When a laptop is selected on the webpage it is updated with new laptop information.
    const selectedLaptop = laptops[e.target.selectedIndex]; //Event shows which laptop was selected.
    priceElement.innerText = selectedLaptop.price; //Price and description is changed to that of new laptop.
    price2Element.innerText = selectedLaptop.price;
    descriptionElement.innerText = selectedLaptop.description;
    for (const child of currentSpecs) { //Old specifications from previous laptop that were added as children are removed.
        specsElement.removeChild(child);
    }
    currentSpecs = []; //CurrentSpecs is reset to empty array.
    const specArray = selectedLaptop.specs; //New specs found.
    for (const spec of specArray) { //New specs looped over.
        addSpecToHTML(spec);
    }
    titleElement.innerText = selectedLaptop.title;
    if(e.target.selectedIndex === 4){ //Fixing Noroff's mistakes ;)
        let imgURL = baseURL + selectedLaptop.image;
        imgURL = imgURL.substring(0, imgURL.length-3)+"png";
        imageElement.src = imgURL;
    }
    else{
        imageElement.src = baseURL + selectedLaptop.image;
    }
}
function addSpecToHTML(spec){ //Whenever specs are added to html it is done here.
    const currentSpec = document.createElement("li"); //list item created.
    currentSpec.innerText = spec; //spec added as text to li.
    currentSpecs.push(currentSpec); //New spec added to list of specs.
    specsElement.appendChild(currentSpec); //New spec added as child to html-element of specs.
}
 

laptopsElement.addEventListener("change", handleLaptopListChange); //Listener that notices change of selected laptop and fires relevant function.
workElement.addEventListener("click", Work.doTheWork.bind(Work)); //Listener that notices Work-button click and fires relevant method.
payOffLoanElement.addEventListener("click", Bank.payOffLoanWithBalance.bind(Bank)); //Listener that notices Pay-off-loan-button click and fires relevant method.
putPayInBankElement.addEventListener("click", Work.putPayInBank.bind(Work)); //Listener that notices Deposit-pay-button click and fires relevant method.
getALoanElement.addEventListener("click", Bank.getALoan.bind(Bank)); //Listener that notices Get-a-loan-button click and fires relevant method.
payOffLoanWithPayElement.addEventListener("click", Work.payOffLoanWithPay.bind(Work)); //Listener that notices pay-off-loan-with-pay-button click and fires relevant method.
buyElement.addEventListener("click", buy); //Listener that notices Buy-button click and fires relevant function.