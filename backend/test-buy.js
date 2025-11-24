const axios = require('axios');

async function testBuy() {
    try {
        console.log('Testing /api/buy endpoint...');
        const response = await axios.post('http://localhost:3000/api/buy', {
            buyer_id: 15,
            product_id: 47
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testBuy();
