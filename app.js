const Bank = {
    balance: 0,
    loan: 0,
    getALoan: function(){
        console.log("Test");
        console.log(this.loan)
        if(this.loan > 0){
            console.log("if")
            return;
        }
        console.log("Test2")
        const loanAmount = prompt("How much money do you need to loan from the bank?");
        if(this.isLoanAmountAcceptable(loanAmount)){
            this.balance += parseInt(loanAmount);
            this.loan = loanAmount;
        }
    },
    isLoanAmountAcceptable(amount){
        if(parseInt(amount) > 2*this.balance){
            return false;
        }
        return true;
    },
    payOffLoanWithBalance(){
        if(loan>0){return}
        if(balance >= loan){
            this.balance -= this.loan;
            this.loan = 0;
        }
        else{
            this.loan -= this.balance;
            this.balance = 0;
        }
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
    }
};
let Work = {
    pay: 0,
    doTheWork: function(){
        console.log(this.pay);
        this.pay += 100;
        console.log(this.pay);
        const newPayElement = document.getElementById("pay").innerText = this.pay;
    },
    putPayInBank: function(){
        if(Bank.loan > 0){
            Bank.payOffLoanPartiallyWithPay(0.1*this.pay);
            Bank.balance += 0.9*this.pay;
            this.pay = 0;
        }
    },
    payOffLoanWithPay: function(){
        Bank.payOffLoanFromOutside(this.pay);
        this.pay = 0;
    }
};
const laptopsElement = document.getElementById("laptops");
const priceElement = document.getElementById("price");
const getALoanElement = document.getElementById("getLoan");
const workElement = document.getElementById("work");
const payOffLoanElement = document.getElementById("payOff");
const putPayInBankElement = document.getElementById("putPayInBank");
const payOffLoanWithPayElement = document.getElementById("payOffLoanWithPay");
const balanceElement = document.getElementById("balance").innerText = Bank.balance;
const loanElement = document.getElementById("loan").innerText = Bank.loan;
const payElement = document.getElementById("pay").innerText = Work.pay;

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
}
function handleLaptopListChange(e){
    const selectedLaptop = laptops[e.target.selectedIndex];
    priceElement.innerText = selectedLaptop.price;
}
 

laptopsElement.addEventListener("change", handleLaptopListChange);
workElement.addEventListener("click", Work.doTheWork.bind(Work));
//payOffLoanElement.addEventListener("click", Bank.payOffLoanWithBalance);
putPayInBankElement.addEventListener("click", Work.putPayInBank.bind(Work));
//payOffLoanWithPayElement.addEventListener("click", Work.payOffLoanWithPay);
getALoanElement.addEventListener("click", Bank.getALoan.bind(Bank));