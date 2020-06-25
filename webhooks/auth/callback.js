
const authCallback = (webhook) => {
  const payload = webhook.payload;
  console.log('Received auth callback:', payload);
}

module.exports = authCallback;

