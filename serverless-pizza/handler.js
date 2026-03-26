const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: process.env.REGION });

const PENDING_ORDERS_QUEUE_URL = process.env.PENDING_ORDERS_QUEUE
const ORDERS_TO_SAVE_QUEUE_URL = process.env.ORDERS_TO_SAVE_QUEUE


exports.newOrder = async (event) => {
	const { v4: uuidv4 } = await import('uuid');
	
	const orderId = uuidv4();

	console.log(orderId);

	let orderDetails;
	try {
		orderDetails = JSON.parse(event.body);
	} catch (error) {
		console.error("Error parsing order details:", error);
		return {
			statusCode: 400,
			body: JSON.stringify({ message: "Invalid JSON format in order details" })
		}
	}

	console.log(orderDetails)

	const order = {orderId, ...orderDetails}

	await sendMessageToSQS(order, PENDING_ORDERS_QUEUE_URL);

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: order
		})
	};
}

exports.getOrder = async (event) => {
	console.log(event)

	const orderId = event.pathParameters.orderId;

	const orderDetails = {
		"pizza": "MargaritaMockeada",
		"customerId": 1,
		"order_status": "COMPLETED"
	}

	const order = {
		orderId, ...orderDetails
	}

	console.log(order)

	return {
		statusCode: 200,
		body: JSON.stringify({message: order})
	};
}

exports.prepOrder = async (event) => {
	console.log(event)

	return ;
}

async function sendMessageToSQS(message, queueUrl) {
	const params = {
		QueueUrl: queueUrl,
		MessageBody: JSON.stringify(message)
	};

	console.log(params);

	try {
		const command = new SendMessageCommand(params);
		const data = await sqsClient.send(command);
		console.log("Message sent successfully:", data.MessageId);
		return data;
	} catch (error) {
		console.error("Error sending message:", error);
		throw error;
	}
}