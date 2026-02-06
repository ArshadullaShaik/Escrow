//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;
contract Escrow{
address payable public payee;
address payable public buyer;
uint public balance;
enum state{
waitingpayment,paymentdone,verifybuyer,txnproceed,cancel
}
state public State;
constructor(address _buyer,address _payee){
    buyer = payable(_buyer);
    payee = payable(_payee);
    State = state.waitingpayment;
}
event prodctsent(string msgs);
event paymentdone(address buyer,address payee,uint amount);
event prodctreceived(string msgs);
event paymentreceived(address buyer,address payee,uint amount);
event refnd(address buyer,uint amount);
modifier onlybuyer(){
    require(buyer==msg.sender,"Your not the buyer");
    _;
}
modifier onlyseller(){
    require(payee==msg.sender,"YOur not the seller");
    _;}
//modifier middleguy(){
   // require(middleman==msg.sender,"You are a scammer");
   // _;
//}
modifier instate(state _State){
    require(State == _State);
    _;
}
function payndconfirm() onlybuyer public payable instate(state.waitingpayment){
    require(msg.value>0,"send enough eth");
    balance+=msg.value;
    emit paymentdone(buyer,payee,msg.value);
    State = state.paymentdone;
}
function productsent() onlyseller public instate(state.paymentdone){
    State = state.verifybuyer;
    emit prodctsent("productsent");
}
function productreceived() onlybuyer public instate(state.verifybuyer){
    State = state.txnproceed;
    emit prodctreceived("productreceived");
}
function getpayment() onlyseller public payable instate(state.txnproceed){
    (bool calldone, ) = payable(payee).call{value:address(this).balance}(" ");
    //bydefault bool is set to false;
    require(calldone,"TransactionFailed");
    emit paymentreceived(buyer,payee,address(this).balance);
    balance = 0;
    State = state.waitingpayment;
}
function refund() onlybuyer public {
    require(State==state.verifybuyer||State==state.paymentdone);
    (bool refunddone,  )=payable(buyer).call{value:address(this).balance}(" ");
    State = state.waitingpayment;
    emit refnd(buyer,address(this).balance);
}
}