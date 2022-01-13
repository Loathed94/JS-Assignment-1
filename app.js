let Bank = {
    balance: 0,
    loan: 0,
    isLoanAmountAcceptable(amount){
        if(amount > 2*this.balance){
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
}
let Work = {
    pay: 0,
    doTheWork(){
        this.pay += 100;
    },
    putPayInBank(){
        if(Bank.loan > 0){
            Bank.payOffLoanPartiallyWithPay(0.1*this.pay);
            Bank.balance += 0.9*this.pay;
            this.pay = 0;
        }
    },
    payOffLoanWithPay(){
        Bank.payOffLoanFromOutside(this.pay);
        this.pay = 0;
    }
}
const laptopsElement = document.getElementById("laptops");
const priceElement = document.getElementById("price");
const getALoanElement = document.getElementById("getLoan");
const workElement = document.getElementById("work");
const payOffLoanElement = document.getElementById("payOff");
const putPayInBankElement = document.getElementById("putPayInBank");

let laptops = [];
fetch("https://noroff-komputer-store-api.herokuapp.com/computers").then(response => response.json()).then(data => laptops = data).then(laptops => addLaptopsToList(laptops));

function addLaptopsToList(laptops){
    for (const laptop of laptops) {
        const laptopElement = document.createElement("option");
        laptopElement.value = laptop.id;
        laptopElement.appendChild(document.createTextNode(laptop.title));
        laptopsElement.appendChild(laptopElement);
    }
}