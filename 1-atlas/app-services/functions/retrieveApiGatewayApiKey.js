exports = async function(arg){
  try {
    return  context.values.get("ApiGatewayApiKeyRef");
  } catch(err) {
    console.log("Error occurred while executing function:", err.message);
    return { error: err.message };
  }
}