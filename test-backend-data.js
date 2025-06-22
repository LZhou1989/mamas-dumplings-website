// Test script to access backend data
const API_BASE = 'http://localhost:3000/api';

async function testBackendData() {
    console.log('🧪 Testing Backend Data Access\n');
    
    try {
        // Test 1: Get all products
        console.log('1️⃣ Testing Products API...');
        const productsResponse = await fetch(`${API_BASE}/products`);
        const productsData = await productsResponse.json();
        
        if (productsData.success) {
            console.log(`✅ Found ${productsData.count} products:`);
            productsData.data.forEach(product => {
                console.log(`   - ${product.name}: €${product.price}`);
            });
        } else {
            console.log('❌ Failed to get products');
        }
        
        console.log('\n2️⃣ Testing Order Statistics...');
        const statsResponse = await fetch(`${API_BASE}/orders/stats/overview`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            console.log('✅ Order Statistics:');
            console.log(`   - Total Orders: ${statsData.data.totalOrders}`);
            console.log(`   - Total Revenue: €${statsData.data.totalRevenue.toFixed(2)}`);
        } else {
            console.log('❌ Failed to get order statistics');
        }
        
        console.log('\n3️⃣ Testing Product Search...');
        const searchResponse = await fetch(`${API_BASE}/products/search/pork`);
        const searchData = await searchResponse.json();
        
        if (searchData.success) {
            console.log(`✅ Found ${searchData.count} products matching "pork":`);
            searchData.data.forEach(product => {
                console.log(`   - ${product.name}`);
            });
        } else {
            console.log('❌ Failed to search products');
        }
        
        console.log('\n🎉 Backend data access test completed!');
        console.log('\n💡 You can also:');
        console.log('   - Visit http://localhost:3000 to see the website');
        console.log('   - Use Postman to test API endpoints');
        console.log('   - Check browser console for API calls');
        
    } catch (error) {
        console.error('❌ Error testing backend data:', error.message);
        console.log('\n💡 Make sure your server is running with: npm run dev');
    }
}

// Run the test
testBackendData(); 