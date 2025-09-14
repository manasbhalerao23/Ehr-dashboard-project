import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getModMedClient } from '@/lib/modmed'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''

    const client = await getModMedClient(session.user.id)
    const modmedPatients = await client.getPatients({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    })

    // Sync with local database
    for (const patient of modmedPatients.data || []) {
      await prisma.patient.upsert({
        where: { modmedId: patient.id },
        update: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null,
          gender: patient.gender,
          address: patient.address,
          allergies: patient.allergies || [],
          medications: patient.medications || [],
          insurance: patient.insurance,
          status: patient.status
        },
        create: {
          modmedId: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null,
          gender: patient.gender,
          address: patient.address,
          allergies: patient.allergies || [],
          medications: patient.medications || [],
          insurance: patient.insurance,
          status: patient.status
        }
      })
    }

    return NextResponse.json(modmedPatients)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
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

    const patientData = await request.json()
    const client = await getModMedClient(session.user.id)
    
    // Create in ModMed
    const modmedPatient = await client.createPatient(patientData)
    
    // Create in local database
    const localPatient = await prisma.patient.create({
      data: {
        modmedId: modmedPatient.id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
        gender: patientData.gender,
        address: patientData.address,
        allergies: patientData.allergies || [],
        medications: patientData.medications || [],
        insurance: patientData.insurance,
        status: 'active'
      }
    })

    return NextResponse.json({ modmed: modmedPatient, local: localPatient })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}