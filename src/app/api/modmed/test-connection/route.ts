import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ModMedClient } from '@/lib/modmed'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clientId, clientSecret, useSandbox } = await request.json()
    
    // Create client with provided credentials
    const client = new ModMedClient()
    
    try {
      await client.authenticate(clientId, clientSecret)
      const isConnected = await client.testConnection()
      
      if (isConnected) {
        return NextResponse.json({ 
          success: true, 
          message: 'Successfully connected to ModMed API' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Connection test failed' 
        })
      }
    } catch (authError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication failed' 
      })
    }
  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      { success: false, message: 'Connection test failed' },
      { status: 500 }
    )
  }
}