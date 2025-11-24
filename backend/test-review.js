const axios = require('axios');

async function testReview() {
    try {
        console.log('Testing /api/reviews endpoint...');
        const response = await axios.post('http://localhost:3000/api/reviews', {
            buyer_id: 15,
            seller_id: 17,
            rating: 5,
            comment: 'Great seller!'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testReview();
