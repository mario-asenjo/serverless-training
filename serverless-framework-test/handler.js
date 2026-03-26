exports.hello = async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Go Serverless! Tu función se ha ejecutado correctamente!"
		})
	};
};

