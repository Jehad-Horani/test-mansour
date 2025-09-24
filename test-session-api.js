const fetch = require('node-fetch')

async function testSessionAPI() {
  console.log('🧪 Testing session API...')

  try {
    const response = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      console.log(`⚠️ Response status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📋 Session API Response:')
    console.log(JSON.stringify(data, null, 2))

    if (data.session) {
      console.log('✅ Session found')
      if (data.userProfile) {
        console.log('✅ User profile found')
        console.log(`📊 Profile data: ${data.userProfile.name} - ${data.userProfile.role}`)
        return true
      } else {
        console.log('⚠️ Session exists but no profile data')
        return false
      }
    } else {
      console.log('⚠️ No active session')
      return false
    }

  } catch (error) {
    console.error('❌ Error testing session API:', error.message)
    return false
  }
}

testSessionAPI().then(success => {
  console.log(success ? '🎉 Session API test completed successfully!' : '❌ Session API test failed!')
})