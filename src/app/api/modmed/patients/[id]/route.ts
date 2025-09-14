import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getModMedClient } from '@/lib/modmed'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await getModMedClient(session.user.id)
    const patient = await client.getPatient(params.id)

    return NextResponse.json(patient)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patientData = await request.json()
    const client = await getModMedClient(session.user.id)
    
    // Update in ModMed
    const modmedPatient = await client.updatePatient(params.id, patientData)
    
    // Update in local database
    const localPatient = await prisma.patient.update({
      where: { modmedId: params.id },
      data: {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
        gender: patientData.gender,
        address: patientData.address,
        allergies: patientData.allergies || [],
        medications: patientData.medications || [],
        insurance: patientData.insurance
      }
    })

    return NextResponse.json({ modmed: modmedPatient, local: localPatient })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await getModMedClient(session.user.id)
    
    // Delete from ModMed
    await client.deletePatient(params.id)
    
    // Update status in local database (soft delete)
    await prisma.patient.update({
      where: { modmedId: params.id },
      data: { status: 'inactive' }
    })

    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}