//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;
contract Escrow{
address payable public payee;
address payable public buyer;
address payable public middleman;
uint public balance;
enum state{
waitingpayment,paymentdone,verifybuyer,txnproceed,cancel
}
state public State;
constructor(address _buyer,address _payee){
    middleman = payable(msg.sender);
    buyer = payable(_buyer);
    payee = payable(_payee);
    State = state.waitingpayment;
}

event paymentdone(address buyer,address payee,uint amount);

modifier onlybuyer(){
    require(buyer==msg.sender||msg.sender==middleman,"Your not the buyer");
    _;
}
modifier onlyseller(){
    require(payee==msg.sender,"YOur not the seller");
    _;}
modifier middleguy(){
    require(middleman==msg.sender,"You are a scammer");
    _;
}
modifier instate(state _State){
    require(State == _State);
    _;
}
function payndconfirm() onlybuyer public payable instate(state.waitingpayment){
    require(msg.value>0,"send enough eth");
    balance+=msg.value;
    State = state.paymentdone;
}
function productsent() onlyseller public instate(state.paymentdone){
    State = state.verifybuyer;
}
function productreceived() onlybuyer public instate(state.verifybuyer){
    State = state.txnproceed;
}
function getpayment() onlyseller public payable instate(state.txnproceed){
    (bool calldone, ) = payable(payee).call{value:balance}(" ");
    //bydefault bool is set to false;
    require(calldone,"TransactionFailed");
    balance = 0;
    State = state.waitingpayment;
}
function refund() onlybuyer public instate(state.verifybuyer){
    (bool refunddone, )=payable(buyer).call{value:balance}(" ");
    State = state.cancel;
}
}