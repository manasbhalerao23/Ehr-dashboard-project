import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getModMedClient } from '@/lib/modmed'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId') ?? undefined
    const providerId = searchParams.get('providerId') ?? undefined
    const date = searchParams.get('date') ?? undefined
    const status = searchParams.get('status') ?? undefined

    const client = await getModMedClient(session.user.id)
    const appointments = await client.getAppointments({
      patient: patientId,
      practitioner: providerId,
      date,
      status
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appointmentData = await request.json()
    const client = await getModMedClient(session.user.id)
    
    const appointment = await client.createAppointment(appointmentData)

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}