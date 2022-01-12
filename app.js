let Bank = {
    balance: 0,
    hasLoan: false,
    loan: 0,
    isLoanAmountAcceptable(amount){
        if(amount > 2*balance){
            return false;
        }
        return true;
    }
}
let Work = {
    pay: 0
}