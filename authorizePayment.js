'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;

const API_LOGIN_ID = 'api_login_id';
const TRANSACTION_KEY = 'transaction_key';
function createAnAcceptPaymentTransaction(dataValue, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(API_LOGIN_ID);
	merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

	var opaqueData = new ApiContracts.OpaqueDataType();
	opaqueData.setDataDescriptor('COMMON.ACCEPT.INAPP.PAYMENT');
	opaqueData.setDataValue(dataValue);
	

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setOpaqueData(opaqueData);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INV-12345');
	orderDetails.setDescription('Monthly Bill');

	var billTo = new ApiContracts.CustomerAddressType();
	billTo.setFirstName('Ellen');
	billTo.setLastName('Johnson');
	billTo.setCompany('Souveniropolis');
	billTo.setAddress('14 Main Street');
	billTo.setCity('Pecan Springs');
	billTo.setState('TX');
	billTo.setZip('44628');
	billTo.setCountry('USA');



	var lineItem_id1 = new ApiContracts.LineItemType();
	lineItem_id1.setItemId('1');
	lineItem_id1.setName('bill');
	lineItem_id1.setDescription('monthly bill');
	lineItem_id1.setQuantity('1');
	lineItem_id1.setUnitPrice(99.00);

	var lineItemList = [];
	lineItemList.push(lineItem_id1);

	var lineItems = new ApiContracts.ArrayOfLineItem();
	lineItems.setLineItem(lineItemList);

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequestType.setPayment(paymentType);
	transactionRequestType.setAmount('99.00');
	transactionRequestType.setLineItems(lineItems);
	transactionRequestType.setOrder(orderDetails);
	transactionRequestType.setBillTo(billTo);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
	//Defaults to sandbox
	//ctrl.setEnvironment(SDKConstants.endpoint.production);

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactionResponse().getMessages() != null){
					console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
					console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
					console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
					console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
				}
				else {
					console.log('Failed Transaction.');
					if(response.getTransactionResponse().getErrors() != null){
						console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
						console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
					}
				}
			}
			else {
				console.log('Failed Transaction. ');
				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
				
					console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
					console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
				}
				else {
					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
				}
			}
		}
		else {
			console.log('Null Response.');
		}

		callback(response);
	});
}

if (require.main === module) {
	createAnAcceptPaymentTransaction(function(){
		console.log('createAnAcceptPaymentTransaction call complete.');
	});
}

module.exports.createAnAcceptPaymentTransaction = createAnAcceptPaymentTransaction;