const fetch = require('node-fetch');

async function testApiCall() {
  console.log('🧪 Testing Registration API Call...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '4b65636d-2e17-4f0d-945c-65a021ecdcc8', // The last user created
        name: 'Final Test User',
        phone: '+962791234567',
        university: 'الجامعة الأردنية',
        major: 'law',
        year: '1'
      })
    })

    console.log('📡 Response status:', response.status)
    const result = await response.json()
    console.log('📝 Response data:', result)

    if (response.ok) {
      console.log('✅ API call successful!')
    } else {
      console.log('❌ API call failed')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testApiCall()