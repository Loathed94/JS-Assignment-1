const Bank = {
    balance: 0,
    loan: 0,
    getALoan: function(){
        if(this.loan > 0){
            return;
        }
        const loanAmount = prompt("How much money do you need to loan from the bank?");
        if(loanAmount === NaN){
            return;
        }
        if(this.isLoanAmountAcceptable(loanAmount)){
            this.balance += parseInt(loanAmount);
            this.loan = parseInt(loanAmount);
        }
        updateElements();
    },
    isLoanAmountAcceptable(amount){
        if(parseInt(amount) > 2*this.balance){
            return false;
        }
        return true;
    },
    payOffLoanWithBalance(){
        if(this.balance >= this.loan){
            this.balance -= this.loan;
            this.loan = 0;
        }
        else{
            this.loan -= this.balance;
            this.balance = 0;
        }
        updateElements();
    },
    payOffLoanFromOutside(amount){
        if(amount > this.loan){
            let residual = amount - this.loan;
            this.loan = 0;
            this.balance += residual;
        }
        else{
            this.loan -= amount;
        }
        updateElements();
    }
};
const Work = {
    pay: 0,
    doTheWork: function(){
        this.pay += 100;
        updateElements();
    },
    putPayInBank: function(){
        if(Bank.loan > 0){
            Bank.payOffLoanFromOutside(0.1*this.pay);
            Bank.balance += 0.9*this.pay;
            this.pay = 0;
        }
        else{
            Bank.balance += this.pay;
            this.pay = 0;
        }
        updateElements();
    },
    payOffLoanWithPay: function(){
        Bank.payOffLoanFromOutside(this.pay);
        this.pay = 0;
        updateElements();
    }
};
function buy(){
    const price = parseInt(priceElement.innerText);
    if(price <= Bank.balance){
        Bank.balance -= price;
    }
    updateElements();
}
function updateElements(){
    payElement.innerText = Work.pay;
    loanElement.innerText = Bank.loan;
    balanceElement.innerText = Bank.balance;
    if(Bank.loan > 0){
        payOffLoanElement.style.display = "block";
        payOffLoanWithPayElement.style.display = "block";
    }
    else{
        payOffLoanElement.style.display = "none";
        payOffLoanWithPayElement.style.display = "none";
    }
};
const laptopsElement = document.getElementById("laptops");
const priceElement = document.getElementById("price");
const specsElement = document.getElementById("specs");
const descriptionElement = document.getElementById("description");
const getALoanElement = document.getElementById("getLoan");
const workElement = document.getElementById("work");
const payOffLoanElement = document.getElementById("payOff");
payOffLoanElement.style.display ="none";
const putPayInBankElement = document.getElementById("putPayInBank");
const payOffLoanWithPayElement = document.getElementById("payOffLoanWithPay");
payOffLoanWithPayElement.style.display = "none";
const balanceElement = document.getElementById("balance");
balanceElement.innerText = Bank.balance;
const loanElement = document.getElementById("loan");
loanElement.innerText = Bank.loan;
const payElement = document.getElementById("pay");
payElement.innerText = Work.pay;
const buyElement = document.getElementById("buy");
let currentSpecs = [];

let laptops = [];
fetch("https://noroff-komputer-store-api.herokuapp.com/computers").then(response => response.json()).then(data => laptops = data).then(laptops => addLaptopsToList(laptops));

function addLaptopsToList(laptops){
    for (const laptop of laptops) {
        const laptopElement = document.createElement("option");
        laptopElement.value = laptop.id;
        laptopElement.appendChild(document.createTextNode(laptop.title));
        laptopsElement.appendChild(laptopElement);
    }
    priceElement.innerText = laptops[0].price;
    descriptionElement.innerText = laptops[0].description;
    for (const spec of laptops[0].specs) {
        addSpecToHTML(spec);
    }
}
function handleLaptopListChange(e){
    const selectedLaptop = laptops[e.target.selectedIndex];
    priceElement.innerText = selectedLaptop.price;
    descriptionElement.innerText = selectedLaptop.description;
    for (const child of currentSpecs) {
        specsElement.removeChild(child);
    }
    currentSpecs = [];
    const specArray = selectedLaptop.specs;
    for (const spec of specArray) {
        addSpecToHTML(spec);
    }
}
function addSpecToHTML(spec){
    const currentSpec = document.createElement("li");
    currentSpec.innerText = spec; //??
    currentSpecs.push(currentSpec);
    specsElement.appendChild(currentSpec);
}
 

laptopsElement.addEventListener("change", handleLaptopListChange);
workElement.addEventListener("click", Work.doTheWork.bind(Work));
payOffLoanElement.addEventListener("click", Bank.payOffLoanWithBalance.bind(Bank));
putPayInBankElement.addEventListener("click", Work.putPayInBank.bind(Work));
getALoanElement.addEventListener("click", Bank.getALoan.bind(Bank));
payOffLoanWithPayElement.addEventListener("click", Work.payOffLoanWithPay.bind(Work));
buyElement.addEventListener("click", buy);