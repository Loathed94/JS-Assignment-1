let Bank = {
    balance: 0,
    hasLoan: false,
    loan: 0,
    isLoanAmountAcceptable(amount){
        if(amount > 2*this.balance){
            return false;
        }
        return true;
    },
    payOffLoan(){
        if(balance >= loan){
            this.balance -= this.loan;
            this.loan = 0;
        }
        else{
            this.loan -= this.balance;
            this.balance = 0;
        }
    }
}
let Work = {
    pay: 0
}