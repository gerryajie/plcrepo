const snap7 = require('node-snap7');

const client = new snap7.S7Client();

function connectPLC(ip) {
  client.ConnectTo(ip, 0, 1, (err) => {
    if (err) {
      console.log('PLC Connection Error:', err);
      reconnect(ip);
    } else {
      console.log('PLC Connected');
    }
  });
}

function reconnect(ip) {
  setTimeout(() => {
    console.log('Reconnecting PLC...');
    connectPLC(ip);
  }, 5000);
}

module.exports = {
  connectPLC,
};